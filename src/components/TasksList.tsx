import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { api } from '../services';
import Icon from './Icon';
import type { 
  PlayerTask, 
  SearchRequest,
  SearchPlayerTasksResponse,
  PlayerTaskStatus,
  LocalizedField,
  OrderMode
} from '../api';
import { OrderMode as OrderModeEnum } from '../api';
import TasksGrid from './TasksGrid';
import TaskCardSkeleton from './TaskCardSkeleton';

interface TasksListProps {
  statusFilter: PlayerTaskStatus[];
  dateFilters?: { from: string; to: string };
  enumFilters?: {[field: string]: string[]};
  onFiltersUpdate?: (filters: LocalizedField[]) => void;
  onTaskClick?: (task: PlayerTask) => void;
  onComplete?: (task: PlayerTask) => void;
  onReplace?: (task: PlayerTask) => void;
}

const TasksList: React.FC<TasksListProps> = ({ 
  statusFilter,
  dateFilters: propDateFilters,
  enumFilters: propEnumFilters,
  onFiltersUpdate,
  onTaskClick,
  onComplete,
  onReplace
}) => {
  const [tasks, setTasks] = useState<PlayerTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [, setAvailableFilters] = useState<LocalizedField[]>([]);
  const [, setAvailableSorts] = useState<string[]>([]);
  
  // Используем переданные фильтры или значения по умолчанию
  const dateFilters = useMemo(() => propDateFilters || { from: '', to: '' }, [propDateFilters]);
  const enumFilters = useMemo(() => propEnumFilters || {}, [propEnumFilters]);
  const sorts: {field: string, mode: OrderMode}[] = useMemo(() => [{
    field: 'createdAt',
    mode: OrderModeEnum.DESC
  }], []);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const currentPageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const isLoadingRef = useRef(false);
  const loadTasksRef = useRef<typeof loadTasks | undefined>(undefined);
  
  const { t } = useLocalization();

  // Загрузка задач
  const loadTasks = useCallback(async (page: number = 0, reset: boolean = false) => {
    if (isLoadingRef.current) return;
    
    // Дополнительная защита: не загружаем если данных больше нет
    if (!reset && !hasMoreRef.current) return;
    
    isLoadingRef.current = true;
    
    if (reset) {
      setLoading(true);
      currentPageRef.current = 0;
    } else {
      setLoadingMore(true);
    }
    
    setError(null);

    try {
      // Объединяем фильтры статусов с переданными enum фильтрами
      const allEnumFilters = [];
      
      // Добавляем фильтр по статусам
      if (statusFilter.length > 0) {
        allEnumFilters.push({
          field: 'status',
          values: statusFilter.map(s => s.toString())
        });
      }
      
      // Добавляем переданные enum фильтры
      if (Object.keys(enumFilters).length > 0) {
        Object.entries(enumFilters).forEach(([field, values]) => {
          if (values.length > 0) {
            allEnumFilters.push({
              field,
              values: values
            });
          }
        });
      }
      
      const request: SearchRequest = {
        options: {
          filter: {
            dateFilters: dateFilters.from && dateFilters.to ? [{
              field: 'createdAt',
              from: dateFilters.from,
              to: dateFilters.to
            }] : undefined,
            enumFilters: allEnumFilters.length > 0 ? allEnumFilters : undefined
          },
          // Всегда отправляем сортировку по createdAt (как в списке транзакций)
          sorts: sorts
        }
      };

      const response: SearchPlayerTasksResponse = await api.searchPlayerTasks(
        request,
        page,
        20 // pageSize
      );
      
      const newTasks = response.tasks || [];
      // Если получили 0 записей, значит больше нет данных, даже если API вернул hasMore: true
      const hasMoreData = newTasks.length > 0 && (response.options?.hasMore || false);
      
      if (reset) {
        setTasks(newTasks);
        setHasMore(hasMoreData);
        currentPageRef.current = 0;
        hasMoreRef.current = hasMoreData;
      } else {
        // Проверяем, что мы действительно получили новые данные
        if (newTasks.length > 0) {
          setTasks(prev => [...prev, ...newTasks]);
          setHasMore(hasMoreData);
          currentPageRef.current = page;
          hasMoreRef.current = hasMoreData;
        } else {
          // Если новых данных нет, значит больше нет страниц
          setHasMore(false);
          hasMoreRef.current = false;
        }
      }
      
      // Обновляем фильтры и сортировки
      if (response.options) {
        setAvailableFilters(response.options.filters || []);
        setAvailableSorts(response.options.sorts || []);
      }
      
      // Уведомляем родительский компонент о доступных фильтрах
      if (response.options?.filters) {
        onFiltersUpdate?.(response.options.filters);
      }
      
    } catch (err) {
      console.error('Error loading tasks:', err);
      setError(t('common.error.loadingData'));
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [statusFilter, dateFilters, enumFilters, sorts, t, onFiltersUpdate]);

  // Сохраняем актуальную версию функции в ref
  useEffect(() => {
    loadTasksRef.current = loadTasks;
  }, [loadTasks]);

  // Настройка Intersection Observer для бесконечного скролла
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Не создаем observer если данных больше нет или идет загрузка
    if (!hasMoreRef.current || loadingMore || isLoadingRef.current) {
      return;
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMoreRef.current && !loadingMore && !isLoadingRef.current) {
        const nextPage = currentPageRef.current + 1;
        loadTasksRef.current?.(nextPage);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, { 
      threshold: 0,
      rootMargin: '200px' // Увеличиваем rootMargin для более раннего срабатывания
    });

    // Используем setTimeout чтобы убедиться, что элемент уже в DOM
    const timeoutId = setTimeout(() => {
      if (loadMoreRef.current && observerRef.current && hasMoreRef.current) {
        observerRef.current.observe(loadMoreRef.current);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingMore, tasks.length]);

  // Загрузка при монтировании и изменении фильтров
  useEffect(() => {
    // Сбрасываем состояние перед загрузкой
    hasMoreRef.current = true;
    currentPageRef.current = 0;
    loadTasks(0, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter.join(','), dateFilters.from, dateFilters.to, JSON.stringify(enumFilters)]);

  // Показываем skeleton во время первой загрузки
  if (loading && tasks.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Показываем ошибку
  if (error && tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <div 
          className="text-lg font-tech font-semibold mb-2"
          style={{
            color: '#e8f4f8',
            textShadow: '0 0 4px rgba(180, 220, 240, 0.2)'
          }}
        >
          {error}
        </div>
        <button
          onClick={() => loadTasks(0, true)}
          className="px-6 py-3 rounded-xl font-tech font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.9) 0%, rgba(5, 8, 18, 0.95) 100%)',
            border: '2px solid rgba(220, 235, 245, 0.3)',
            color: '#e8f4f8',
            boxShadow: '0 0 15px rgba(180, 220, 240, 0.2)'
          }}
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  // Показываем пустое состояние
  if (tasks.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div 
          className="relative inline-flex items-center justify-center w-20 h-20 rounded-full mb-6 mx-auto"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
            border: '2px solid rgba(220, 235, 245, 0.2)',
            boxShadow: '0 0 20px rgba(180, 220, 240, 0.15)'
          }}
        >
          <div
            className="profile-icon-wrapper"
            style={{
              color: 'rgba(180, 220, 240, 0.9)',
              filter: 'drop-shadow(0 0 8px rgba(180, 220, 240, 0.6))'
            }}
          >
            <Icon type="check" size={32} />
          </div>
        </div>
        <h3 
          className="text-lg font-tech font-semibold mb-2"
          style={{
            color: '#e8f4f8',
            textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
          }}
        >
          {t('tasks.noCompletedTasks')}
        </h3>
        <p 
          className="text-sm font-tech"
          style={{
            color: 'rgba(220, 235, 245, 0.7)'
          }}
        >
          {t('tasks.noCompletedTasksDescription')}
        </p>
      </div>
    );
  }

  return (
    <>
      <TasksGrid
        tasks={tasks}
        loading={false}
        onTaskClick={onTaskClick || (() => {})}
        onComplete={onComplete}
        onReplace={onReplace}
      />
      
      {/* Индикатор загрузки для дополнительных задач */}
      {loadingMore && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <TaskCardSkeleton key={i} />
          ))}
        </div>
      )}
      
      {/* Элемент для отслеживания Intersection Observer */}
      {hasMoreRef.current && !loadingMore && (
        <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
          <div className="text-xs font-tech" style={{ color: 'rgba(220, 235, 245, 0.5)' }}>
            Загрузка...
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(TasksList);

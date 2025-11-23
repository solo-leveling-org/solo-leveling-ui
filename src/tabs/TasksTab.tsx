import React, { useState, useEffect, useCallback } from 'react';
import type { PlayerTask, CompleteTaskResponse, LocalizedField } from '../api';
import { PlayerTaskStatus as TaskStatus } from '../api';
import TasksGrid from '../components/TasksGrid';
import TasksList from '../components/TasksList';
import TaskDialog from '../components/TaskDialog';
import TaskCompletionDialog from '../components/TaskCompletionDialog';
import TaskCardSkeleton from '../components/TaskCardSkeleton';
import DateFilter from '../components/DateFilter';
import FilterDropdown from '../components/FilterDropdown';
import { taskActions, api } from '../services';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '../hooks/useLocalization';
import { useTasksRefresh } from '../hooks/useTasksRefresh';
import ConfirmDialog from '../components/ConfirmDialog';

type TasksTabProps = {
  isAuthenticated: boolean;
};

type TaskViewMode = 'active' | 'completed';

const TasksTab: React.FC<TasksTabProps> = ({ isAuthenticated }) => {
  const [tasks, setTasks] = useState<PlayerTask[]>([]);
  const [firstTime, setFirstTime] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<TaskViewMode>('active');
  const [contentLoaded, setContentLoaded] = useState(false);
  const [dialogTask, setDialogTask] = useState<PlayerTask | null>(null);
  const [completionResponse, setCompletionResponse] = useState<CompleteTaskResponse | null>(null);
  const [completedTask, setCompletedTask] = useState<PlayerTask | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'complete' | 'replace';
    task: PlayerTask;
  } | null>(null);
  const [dateFilters, setDateFilters] = useState({ from: '', to: '' });
  const [enumFilters, setEnumFilters] = useState<{[field: string]: string[]}>({});
  const [availableFilters, setAvailableFilters] = useState<LocalizedField[]>([]);
  const navigate = useNavigate();
  const { t } = useLocalization();

  // Функция для обновления списка задач
  const handleTasksUpdate = (newTasks: PlayerTask[]) => {
    setTasks(newTasks);
    // Если задачи появились, значит firstTime стал false
    if (newTasks.length > 0) {
      setFirstTime(false);
    }
  };

  // Используем хук для автоматического обновления задач при уведомлениях
  useTasksRefresh({
    isAuthenticated,
    onTasksUpdate: handleTasksUpdate,
  });

  // Загружаем задачи только при монтировании компонента и если авторизованы
  useEffect(() => {
    if (isAuthenticated) {
      setContentLoaded(false);
      api.getPlayerTasks()
        .then((res) => {
          setTasks(res.tasks);
          setFirstTime(res.firstTime);
          setLoading(false);
          // Запускаем анимацию появления контента
          setTimeout(() => {
            setContentLoaded(true);
          }, 50);
        })
        .catch((error) => {
          console.error('Error getting tasks:', error);
          setLoading(false);
          setTimeout(() => {
            setContentLoaded(true);
          }, 50);
        });
    } else {
      // Если не авторизованы, не показываем loading
      setLoading(false);
      setContentLoaded(true);
    }
  }, [isAuthenticated]);

  const handleGoToTopics = () => {
    navigate('/topics');
  };

  const handleCompleteTask = async (task: PlayerTask) => {
    setConfirmAction({ type: 'complete', task });
    setShowConfirmDialog(true);
  };

  const completeTask = async (task: PlayerTask) => {
    try {
      setLoading(true);
      const response = await taskActions.completeTask(task);
      // Сохраняем выполненную задачу для отображения в диалоге
      setCompletedTask(task);
      // Показываем диалог с результатами выполнения задачи
      setCompletionResponse(response);
    } catch (error) {
      console.error('Error completing task:', error);
    } finally {
      setLoading(false);
    }
  };

  const skipTask = async (playerTask: PlayerTask) => {
    try {
      setLoading(true);
      await taskActions.skipTask(playerTask);
      // WebSocket уведомления автоматически обновят список задач
    } catch (error) {
      console.error('Error skipping task:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmAction = () => {
    if (confirmAction) {
      if (confirmAction.type === 'complete') {
        completeTask(confirmAction.task);
      } else if (confirmAction.type === 'replace') {
        skipTask(confirmAction.task);
      }
      setShowConfirmDialog(false);
      setConfirmAction(null);
    }
  };

  const handleCancelConfirm = () => {
    setShowConfirmDialog(false);
    setConfirmAction(null);
  };

  // Обработчики фильтров
  const handleDateFilterChange = useCallback((from: string, to: string) => {
    setDateFilters({ from, to });
  }, []);

  const handleEnumFilterChange = useCallback((field: string, values: string[]) => {
    setEnumFilters(prev => ({
      ...prev,
      [field]: values
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setDateFilters({ from: '', to: '' });
    setEnumFilters({});
  }, []);

  const handleFiltersUpdate = useCallback((filters: LocalizedField[]) => {
    setAvailableFilters(filters);
  }, []);

  // Показываем skeleton во время загрузки
  if (loading) {
    return (
      <div 
        className="fixed inset-0 overflow-y-auto overflow-x-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #000000 0%, #0a0e1a 50%, #0d1220 100%)',
          boxSizing: 'border-box'
        }}
      >
        {/* Holographic grid background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(200, 230, 245, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200, 230, 245, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center center'
          }}></div>
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15" style={{
          background: 'rgba(180, 216, 232, 0.8)'
        }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-10" style={{
          background: 'rgba(200, 230, 245, 0.6)'
        }}></div>

        <div className="relative z-10 min-h-screen pt-16 md:pt-20 px-4 md:px-6 pb-24">
          <div className="max-w-7xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="text-center mb-8">
              <div className="h-8 md:h-10 rounded-lg w-48 sm:w-64 mx-auto mb-3 animate-pulse" style={{
                background: 'rgba(220, 235, 245, 0.1)'
              }}></div>
          <div className="space-y-2 mb-6">
                <div className="h-4 rounded-lg w-full max-w-2xl mx-auto animate-pulse" style={{
                  background: 'rgba(220, 235, 245, 0.1)'
                }}></div>
                <div className="h-4 rounded-lg w-3/4 max-w-xl mx-auto animate-pulse" style={{
                  background: 'rgba(220, 235, 245, 0.1)'
                }}></div>
          </div>
              <div className="w-24 sm:w-32 md:w-40 h-1 rounded-full mx-auto animate-pulse" style={{
                background: 'rgba(180, 220, 240, 0.6)',
                boxShadow: '0 0 8px rgba(180, 220, 240, 0.4)'
              }}></div>
        </div>

        {/* Tasks grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
                <TaskCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (firstTime) {
    return (
      <div 
        className={`fixed inset-0 overflow-y-auto overflow-x-hidden ${contentLoaded ? 'tab-content-enter-active' : ''}`}
        style={{ 
          background: 'linear-gradient(135deg, #000000 0%, #0a0e1a 50%, #0d1220 100%)',
          boxSizing: 'border-box',
          opacity: contentLoaded ? 1 : 0,
          transform: contentLoaded ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
        }}
      >
        {/* Holographic grid background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(rgba(200, 230, 245, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(200, 230, 245, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
            transform: 'perspective(500px) rotateX(60deg)',
            transformOrigin: 'center center'
          }}></div>
        </div>

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15" style={{
          background: 'rgba(180, 216, 232, 0.8)'
        }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-10" style={{
          background: 'rgba(200, 230, 245, 0.6)'
        }}></div>

        <div className="relative z-10 min-h-screen flex items-center justify-center pt-16 md:pt-20 px-4 md:px-6 pb-24">
          <div className="max-w-2xl mx-auto text-center">
        {/* Empty state */}
            <div className="py-12 px-4">
          {/* Icon */}
              <div 
                className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full mb-6"
                style={{
                  background: 'linear-gradient(135deg, rgba(180, 220, 240, 0.2) 0%, rgba(160, 210, 235, 0.15) 100%)',
                  border: '2px solid rgba(220, 235, 245, 0.3)',
                  boxShadow: '0 0 20px rgba(180, 220, 240, 0.3)'
                }}
              >
                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                  color: '#e8f4f8',
                  filter: 'drop-shadow(0 0 4px rgba(180, 220, 240, 0.5))'
                }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>

          {/* Title */}
              <h2 
                className="text-2xl sm:text-3xl font-tech font-bold mb-4"
                style={{
                  color: '#e8f4f8',
                  textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
                }}
              >
            {t('tasks.noTasks.title')}
          </h2>

          {/* Subtitle */}
              <p 
                className="text-base sm:text-lg mb-8 leading-relaxed max-w-md mx-auto"
                style={{
                  color: 'rgba(220, 235, 245, 0.7)'
                }}
              >
            {t('tasks.noTasks.subtitle')}
          </p>

          {/* Action button */}
          <button
            onClick={handleGoToTopics}
                className="group relative overflow-hidden px-8 py-4 rounded-2xl font-tech text-sm tracking-[0.15em] uppercase transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.9) 0%, rgba(5, 8, 18, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(220, 235, 245, 0.3)',
                  boxShadow: '0 0 20px rgba(180, 220, 240, 0.2)',
                  color: '#e8f4f8'
                }}
          >
                <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
              {t('tasks.noTasks.button')}
            </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`fixed inset-0 overflow-y-auto overflow-x-hidden ${contentLoaded ? 'tab-content-enter-active' : ''}`}
      style={{ 
        background: 'linear-gradient(135deg, #000000 0%, #0a0e1a 50%, #0d1220 100%)',
        boxSizing: 'border-box',
        opacity: contentLoaded ? 1 : 0,
        transform: contentLoaded ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
      }}
    >
      {/* Holographic grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(200, 230, 245, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 230, 245, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center center'
        }}></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15" style={{
        background: 'rgba(180, 216, 232, 0.8)'
      }}></div>
      <div className="absolute bottom-1/3 right-1/3 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-10" style={{
        background: 'rgba(200, 230, 245, 0.6)'
      }}></div>

      <div className="relative z-10 min-h-screen pt-16 md:pt-20 px-4 md:px-6 pb-24">
        <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
            <h1 
              className="text-2xl sm:text-3xl md:text-4xl font-tech font-bold mb-3 tracking-tight"
              style={{
                color: '#e8f4f8',
                textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
              }}
            >
          {t('tasks.title')}
        </h1>

            <p 
              className="mb-6 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto px-4"
              style={{
                color: 'rgba(220, 235, 245, 0.7)'
              }}
            >
          {t('tasks.subtitle')}
        </p>

            {/* Divider */}
            <div
              className="w-24 sm:w-32 md:w-40 h-1 rounded-full mx-auto mb-6"
              style={{
                background: 'rgba(180, 220, 240, 0.6)',
                boxShadow: '0 0 8px rgba(180, 220, 240, 0.4)'
              }}
            ></div>

            {/* View Mode Toggle */}
            <div className="flex justify-center mb-6">
              <div 
                className="inline-flex rounded-xl p-1"
                style={{
                  background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.9) 0%, rgba(5, 8, 18, 0.95) 100%)',
                  border: '2px solid rgba(220, 235, 245, 0.2)',
                  boxShadow: '0 0 15px rgba(180, 220, 240, 0.15)'
                }}
              >
                <button
                  onClick={() => setViewMode('active')}
                  className={`px-6 py-2.5 rounded-lg font-tech font-semibold text-sm transition-all duration-300 ${
                    viewMode === 'active' ? '' : 'opacity-60 hover:opacity-80'
                  }`}
                  style={viewMode === 'active' ? {
                    background: 'linear-gradient(135deg, rgba(180, 220, 240, 0.15) 0%, rgba(160, 210, 235, 0.08) 100%)',
                    border: '1px solid rgba(180, 220, 240, 0.4)',
                    color: '#e8f4f8',
                    boxShadow: '0 0 15px rgba(180, 220, 240, 0.3)',
                    textShadow: '0 0 4px rgba(180, 220, 240, 0.2)'
                  } : {
                    background: 'transparent',
                    border: '1px solid transparent',
                    color: 'rgba(220, 235, 245, 0.7)'
                  }}
                >
                  {t('tasks.viewMode.active')}
                </button>
                <button
                  onClick={() => setViewMode('completed')}
                  className={`px-6 py-2.5 rounded-lg font-tech font-semibold text-sm transition-all duration-300 ${
                    viewMode === 'completed' ? '' : 'opacity-60 hover:opacity-80'
                  }`}
                  style={viewMode === 'completed' ? {
                    background: 'linear-gradient(135deg, rgba(180, 220, 240, 0.15) 0%, rgba(160, 210, 235, 0.08) 100%)',
                    border: '1px solid rgba(180, 220, 240, 0.4)',
                    color: '#e8f4f8',
                    boxShadow: '0 0 15px rgba(180, 220, 240, 0.3)',
                    textShadow: '0 0 4px rgba(180, 220, 240, 0.2)'
                  } : {
                    background: 'transparent',
                    border: '1px solid transparent',
                    color: 'rgba(220, 235, 245, 0.7)'
                  }}
                >
                  {t('tasks.viewMode.completed')}
                </button>
              </div>
            </div>
      </div>

          {/* Фильтры для завершенных задач */}
          {viewMode === 'completed' && (
            <div className="mb-6">
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
                {/* Date Range Filter */}
                <DateFilter
                  from={dateFilters.from}
                  to={dateFilters.to}
                  onChange={handleDateFilterChange}
                />

                {/* Enum Filters */}
                {availableFilters.map((filter) => (
                  <FilterDropdown
                    key={filter.field}
                    label={filter.localization}
                    options={filter.items}
                    selectedValues={enumFilters[filter.field] || []}
                    onSelectionChange={(values) => handleEnumFilterChange(filter.field, values)}
                  />
                ))}

                {/* Clear Filters Button - Solo Leveling Style */}
                <button
                  onClick={handleClearFilters}
                  className="flex items-center justify-center px-4 py-3 rounded-xl font-tech font-semibold text-xs md:text-sm transition-all duration-300 hover:scale-105 active:scale-95 whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(185, 28, 28, 0.08) 100%)',
                    border: '1px solid rgba(220, 38, 38, 0.4)',
                    color: '#e8f4f8',
                    boxShadow: '0 0 10px rgba(220, 38, 38, 0.2)',
                    textShadow: '0 0 4px rgba(220, 38, 38, 0.2)'
                  }}
                >
                  {t('tasks.filters.reset')}
                </button>
              </div>
            </div>
          )}

          {/* Tasks Grid or List */}
          {viewMode === 'active' ? (
      <TasksGrid
        tasks={tasks}
        loading={loading}
        onTaskClick={(playerTask) => {
          if (playerTask.task) setDialogTask(playerTask);
        }}
        onComplete={handleCompleteTask}
        onReplace={async (playerTask) => {
          if (loading) return;
          setConfirmAction({ type: 'replace', task: playerTask });
          setShowConfirmDialog(true);
        }}
      />
          ) : (
            <TasksList
              statusFilter={[TaskStatus.COMPLETED, TaskStatus.SKIPPED]}
              dateFilters={dateFilters}
              enumFilters={enumFilters}
              onFiltersUpdate={handleFiltersUpdate}
              onTaskClick={(playerTask) => {
                if (playerTask.task) setDialogTask(playerTask);
              }}
            />
          )}

      {dialogTask && dialogTask.task && (
        <TaskDialog 
          task={dialogTask.task} 
          onClose={() => setDialogTask(null)}
          isOpen={!!dialogTask}
        />
      )}

      {completionResponse && (
        <TaskCompletionDialog 
          response={completionResponse}
          completedTask={completedTask?.task}
          onClose={() => {
            setCompletionResponse(null);
            setCompletedTask(null);
          }} 
          isOpen={!!completionResponse}
        />
      )}

      <ConfirmDialog
        isOpen={showConfirmDialog}
        message={confirmAction?.type === 'complete' 
          ? t('tasks.confirm.complete') 
          : t('tasks.confirm.replace')
        }
        onConfirm={handleConfirmAction}
        onCancel={handleCancelConfirm}
        confirmText={confirmAction?.type === 'complete' 
          ? t('tasks.buttons.complete') 
          : t('tasks.buttons.replace')
        }
        cancelText={t('common.cancel')}
      />
        </div>
      </div>
    </div>
  );
};

export default TasksTab; 
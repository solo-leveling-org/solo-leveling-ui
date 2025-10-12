import React from 'react';
import { api } from '../services';
import { useLocalization } from '../hooks/useLocalization';
import AbstractDataList, { DataItem } from './AbstractDataList';
import Icon from './Icon';
import type { 
  PlayerTask,
  Filter,
  Sort,
  ResponseQueryOptions
} from '../api';

// Расширяем базовый тип для задач
interface TaskItem extends DataItem {
  id: string;
  version: number;
  title: string;
  description: string;
  status: string;
  experience: number;
  currencyReward: number;
  createdAt: string;
}

type TasksListProps = {
  onTasksLoad?: (tasks: PlayerTask[]) => void;
  className?: string;
};

const TasksList: React.FC<TasksListProps> = ({ 
  onTasksLoad, 
  className = '' 
}) => {
  const { t } = useLocalization();

  // Метод загрузки данных для абстрактного компонента
  const loadTasks = async (
    page: number, 
    pageSize: number, 
    filters?: Filter, 
    sorts?: Sort[]
  ) => {
    // Здесь можно добавить логику загрузки задач с фильтрацией
    // Пока используем простую загрузку активных задач
    const response = await api.getPlayerTasks();
    
    return {
      data: response.tasks as TaskItem[],
      options: {
        totalRowCount: response.tasks.length,
        totalPageCount: 1,
        filters: [],
        sorts: []
      } as ResponseQueryOptions
    };
  };

  // Получение цвета статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'IN_PROGRESS':
        return 'text-blue-600 bg-blue-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  // Рендер элемента задачи
  const renderTask = (task: TaskItem, index: number, getLocalizedValue: (field: string, value: string) => string) => (
    <div
      key={task.id}
      className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
          {t(`tasks.status.${task.status.toLowerCase()}`)}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-sm text-gray-600">
            <Icon type="star" size={16} className="mr-1" />
            <span>{task.experience} XP</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Icon type="coins" size={16} className="mr-1" />
            <span>{task.currencyReward} GCO</span>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );

  // Рендер скелетона
  const renderSkeleton = () => (
    <>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 animate-pulse">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-2/3"></div>
            </div>
            <div className="h-6 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
            <div className="h-3 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      ))}
    </>
  );

  // Рендер пустого состояния
  const renderEmpty = () => (
    <div className="text-center py-8">
      <div className="text-gray-500 mb-2">📋</div>
      <div className="text-gray-500">{t('tasks.noTasks.title')}</div>
    </div>
  );

  return (
    <div className={className}>
      <AbstractDataList<TaskItem>
        loadData={loadTasks}
        renderItem={renderTask}
        renderSkeleton={renderSkeleton}
        renderEmpty={renderEmpty}
        onDataLoad={(tasks) => {
          if (onTasksLoad) {
            onTasksLoad(tasks as PlayerTask[]);
          }
        }}
        className="mt-6"
        pageSize={10}
        showFilters={false} // Для задач пока не нужны фильтры
        showPagination={true}
        autoLoad={true}
      />
    </div>
  );
};

export default TasksList;

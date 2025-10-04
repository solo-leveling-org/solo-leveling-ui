import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useWebSocketNotifications } from './useWebSocketNotifications';
import { api } from '../services';
import type { PlayerTask } from '../api';

interface UseTasksRefreshProps {
  isAuthenticated: boolean;
  onTasksUpdate: (tasks: PlayerTask[]) => void;
}

export const useTasksRefresh = ({ isAuthenticated, onTasksUpdate }: UseTasksRefreshProps) => {
  const location = useLocation();
  const isTasksTabActive = location.pathname === '/tasks';

  const refreshTasks = useCallback(async () => {
    if (!isAuthenticated || !isTasksTabActive) return;
    
    try {
      const response = await api.getPlayerTasks();
      onTasksUpdate(response.tasks);
    } catch (error) {
      console.error('Error refreshing tasks:', error);
    }
  }, [isAuthenticated, isTasksTabActive, onTasksUpdate]);

  // Подключаемся к WebSocket уведомлениям
  useWebSocketNotifications(isAuthenticated);

  // Слушаем уведомления через глобальное событие
  useEffect(() => {
    if (!isAuthenticated || !isTasksTabActive) return;

    const handleTasksNotification = (event: CustomEvent) => {
      const { source } = event.detail;
      if (source === 'tasks') {
        refreshTasks();
      }
    };

    // Добавляем слушатель для кастомного события
    window.addEventListener('tasks-notification', handleTasksNotification as EventListener);

    return () => {
      window.removeEventListener('tasks-notification', handleTasksNotification as EventListener);
    };
  }, [isAuthenticated, isTasksTabActive, refreshTasks]);

  return { refreshTasks };
};

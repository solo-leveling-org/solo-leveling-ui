import React, { useState, useEffect } from 'react';
import type { PlayerTask, CompleteTaskResponse } from '../api';
import TasksGrid from '../components/TasksGrid';
import TaskDialog from '../components/TaskDialog';
import TaskCompletionDialog from '../components/TaskCompletionDialog';
import { taskActions, api } from '../services';
import { useNavigate } from 'react-router-dom';
import { useLocalization } from '../hooks/useLocalization';
import { useTasksRefresh } from '../hooks/useTasksRefresh';
import ConfirmDialog from '../components/ConfirmDialog';

type TasksTabProps = {
  isAuthenticated: boolean;
};

const TasksTab: React.FC<TasksTabProps> = ({ isAuthenticated }) => {
  const [tasks, setTasks] = useState<PlayerTask[]>([]);
  const [firstTime, setFirstTime] = useState(false);
  const [loading, setLoading] = useState(true);
  const [dialogTask, setDialogTask] = useState<PlayerTask | null>(null);
  const [completionResponse, setCompletionResponse] = useState<CompleteTaskResponse | null>(null);
  const [completedTask, setCompletedTask] = useState<PlayerTask | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{
    type: 'complete' | 'replace';
    task: PlayerTask;
  } | null>(null);
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
      api.getPlayerTasks()
        .then((res) => {
          setTasks(res.tasks);
          setFirstTime(res.firstTime);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error getting tasks:', error);
          setLoading(false);
        });
    } else {
      // Если не авторизованы, не показываем loading
      setLoading(false);
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

  // Показываем skeleton во время загрузки
  if (loading) {
    return (
      <div className="space-y-6 pb-20">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <div className="h-8 md:h-10 bg-gray-300 rounded-lg w-48 sm:w-64 mx-auto mb-3 animate-pulse"></div>
          <div className="space-y-2 mb-6">
            <div className="h-4 bg-gray-300 rounded-lg w-full max-w-2xl mx-auto animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded-lg w-3/4 max-w-xl mx-auto animate-pulse"></div>
          </div>
          <div className="w-16 h-1 bg-gray-300 rounded-full mx-auto animate-pulse"></div>
        </div>

        {/* Tasks grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl p-4 sm:p-6 animate-pulse">
              <div className="flex items-start justify-between mb-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-300 rounded-full"></div>
                <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gray-300 rounded"></div>
              </div>
              <div className="space-y-2 sm:space-y-3">
                <div className="h-4 sm:h-5 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-3 sm:h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
              <div className="mt-3 sm:mt-4 flex items-center justify-between">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="w-3 h-3 sm:w-4 sm:h-4 bg-gray-300 rounded"></div>
                  <div className="h-2 sm:h-3 bg-gray-300 rounded w-12 sm:w-16"></div>
                </div>
                <div className="h-6 sm:h-8 bg-gray-300 rounded w-16 sm:w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (firstTime) {
    return (
      <div className="space-y-6 pb-20">
        {/* Empty state */}
        <div className="text-center py-12 px-4">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-6 shadow-xl">
            <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            {t('tasks.noTasks.title')}
          </h2>

          {/* Subtitle */}
          <p className="text-gray-600 text-base sm:text-lg mb-8 leading-relaxed max-w-md mx-auto">
            {t('tasks.noTasks.subtitle')}
          </p>

          {/* Action button */}
          <button
            onClick={handleGoToTopics}
            className="inline-flex items-center px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-0 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            {t('tasks.noTasks.button')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-3 tracking-tight">
          {t('tasks.title')}
        </h1>

        <p className="text-gray-600 mb-6 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto px-4">
          {t('tasks.subtitle')}
        </p>

        <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
      </div>

      {/* Tasks Grid */}
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

      {dialogTask && dialogTask.task && (
        <TaskDialog task={dialogTask.task} onClose={() => setDialogTask(null)} />
      )}

      {completionResponse && (
        <TaskCompletionDialog 
          response={completionResponse}
          completedTask={completedTask?.task}
          onClose={() => {
            setCompletionResponse(null);
            setCompletedTask(null);
          }} 
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
  );
};

export default TasksTab; 
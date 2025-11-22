import React, { useState, useEffect } from 'react';
import type { PlayerTask, CompleteTaskResponse } from '../api';
import TasksGrid from '../components/TasksGrid';
import TaskDialog from '../components/TaskDialog';
import TaskCompletionDialog from '../components/TaskCompletionDialog';
import TaskCardSkeleton from '../components/TaskCardSkeleton';
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
              <div className="w-16 h-1 rounded-full mx-auto animate-pulse" style={{
                background: 'rgba(220, 235, 245, 0.1)'
              }}></div>
            </div>

            {/* Tasks grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-6">
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

            <div 
              className="w-16 sm:w-24 h-1 rounded-full mx-auto"
              style={{
                background: 'linear-gradient(90deg, rgba(180, 220, 240, 0.6) 0%, rgba(160, 210, 235, 0.4) 100%)',
                boxShadow: '0 0 10px rgba(180, 220, 240, 0.3)'
              }}
            ></div>
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
      </div>
    </div>
  );
};

export default TasksTab; 
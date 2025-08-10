import React, { useState, useEffect } from 'react';
import type { PlayerTask } from '../api';
import TasksGrid from '../components/TasksGrid';
import TaskDialog from '../components/TaskDialog';
import { taskActions, api } from '../services';
import { useNavigate } from 'react-router-dom';

type TasksTabProps = {
  isAuthenticated: boolean;
};

const TasksTab: React.FC<TasksTabProps> = ({ isAuthenticated }) => {
  const [tasks, setTasks] = useState<PlayerTask[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogTask, setDialogTask] = useState<PlayerTask | null>(null);
  const navigate = useNavigate();

  // Загружаем задачи только при монтировании компонента и если авторизованы
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      api.getPlayerTasks()
        .then((res) => {
          setTasks(res.tasks);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error getting tasks:', error);
          setLoading(false);
        });
    }
  }, [isAuthenticated]);

  const handleGoToTopics = () => {
    navigate('/topics');
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="relative min-h-screen">
        {/* Enhanced background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/8 to-purple-400/8 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-0 w-80 h-80 bg-gradient-to-tr from-pink-400/8 to-orange-400/8 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/5 to-emerald-400/5 rounded-full blur-2xl"></div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 tracking-tight">
              Твои задачи
            </h1>

            <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              Развивайся каждый день с персональными заданиями
            </p>

            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
          </div>

          <TasksGrid tasks={[]} loading={true} onTaskClick={() => {}} />
        </div>
      </div>
    );
  }

  if (!tasks.length) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/10 to-orange-400/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 max-w-md mx-auto px-6 text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-8 shadow-xl">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
            Выбери свои темы
          </h2>

          {/* Subtitle */}
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Это поможет подобрать для тебя лучшие задачи и создать персональный план развития
          </p>

          {/* Action button */}
          <button
            onClick={handleGoToTopics}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-0 focus:outline-none focus:ring-4 focus:ring-blue-400/30"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Перейти к темам
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen">
      {/* Enhanced background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/8 to-purple-400/8 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 left-0 w-80 h-80 bg-gradient-to-tr from-pink-400/8 to-orange-400/8 rounded-full blur-3xl animate-float-delayed"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/5 to-emerald-400/5 rounded-full blur-2xl"></div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Modern header with glassmorphism */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-8 shadow-2xl backdrop-blur-sm border"
            style={{
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(147, 51, 234, 0.15))',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}
                      >
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>

                      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 tracking-tight">
              Твои задачи
            </h1>

            <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              Развивайся каждый день с персональными заданиями
            </p>

            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
        </div>

        <TasksGrid
          tasks={tasks}
          loading={loading}
          onTaskClick={(playerTask) => {
            if (playerTask.task) setDialogTask(playerTask);
          }}
          onComplete={async (playerTask) => {
            if (loading) return;
            const updated = await taskActions.completeTask(playerTask);
            setTasks(updated);
          }}
          onReplace={async (playerTask) => {
            if (loading) return;
            const updated = await taskActions.replaceTask(playerTask);
            setTasks(updated);
          }}
        />
      </div>

      {dialogTask && dialogTask.task && (
        <TaskDialog task={dialogTask.task} onClose={() => setDialogTask(null)} />
      )}
    </div>
  );
};

export default TasksTab; 
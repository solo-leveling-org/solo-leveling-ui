import React, { useState } from 'react';
import type { PlayerTask } from '../../api';
import { TaskTopic } from '../../api';
import TasksGrid from '../../components/TasksGrid';
import TaskDialog from '../../components/TaskDialog';
import { taskActions } from '../../services';

type TasksTabProps = {
  tasks: PlayerTask[];
  topics: TaskTopic[];
  selectedTopics: TaskTopic[];
  onTopicToggle: (t: TaskTopic) => void;
  onGenerateTasks: () => void;
  onResetTasks: () => void;
  loading: boolean;
  setTasks: React.Dispatch<React.SetStateAction<PlayerTask[]>>;
  onGoToTopics: () => void;
};

const TasksTab: React.FC<TasksTabProps> = ({
  tasks,
  topics,
  selectedTopics,
  onTopicToggle,
  onGenerateTasks,
  onResetTasks,
  loading,
  setTasks,
  onGoToTopics,
}) => {
  const [dialogTask, setDialogTask] = useState<PlayerTask | null>(null);

  if (loading) {
    return <TasksGrid tasks={[]} loading={true} onTaskClick={() => {}} />;
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
            <span className="text-3xl">📋</span>
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
            onClick={onGoToTopics}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span className="mr-2">🎯</span>
            Выбрать топики
          </button>

          {/* Decorative line */}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mt-8"></div>
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
            <span className="text-3xl">⚔️</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-800 via-blue-700 to-indigo-800 bg-clip-text text-transparent mb-4 tracking-tight">
            Твои задачи
          </h1>
          
          <p className="text-slate-600 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
            Развивайся каждый день с персональными заданиями
          </p>
          
          <div className="w-32 h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 rounded-full mx-auto shadow-lg"></div>
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
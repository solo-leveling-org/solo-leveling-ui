import React from 'react';
import type { PlayerTask } from '../api';
import { PlayerTaskStatus } from '../api';
import TaskCard from './TaskCard';
import TaskCardSkeleton from './TaskCardSkeleton';

type TasksGridProps = {
  tasks: PlayerTask[];
  loading: boolean;
  onTaskClick: (task: PlayerTask) => void;
  onComplete?: (task: PlayerTask) => void;
  onReplace?: (task: PlayerTask) => void;
};

const TasksGrid: React.FC<TasksGridProps> = ({ tasks, loading, onTaskClick, onComplete, onReplace }) => {
  const visibleTasks = tasks.filter(
    t => t.status === PlayerTaskStatus.PREPARING ||
         t.status === PlayerTaskStatus.IN_PROGRESS ||
         t.status === PlayerTaskStatus.PENDING_COMPLETION
  );

  if (loading && visibleTasks.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {visibleTasks.map((playerTask, index) => (
        <TaskCard
          key={playerTask.id}
          playerTask={playerTask}
          onClick={() => onTaskClick(playerTask)}
          onComplete={playerTask.status === PlayerTaskStatus.IN_PROGRESS ? () => onComplete && onComplete(playerTask) : undefined}
          onReplace={playerTask.status === PlayerTaskStatus.IN_PROGRESS ? () => onReplace && onReplace(playerTask) : undefined}
          index={index}
        />
      ))}
      
      {loading && (
        <div 
          className="group relative overflow-hidden flex flex-col items-center justify-center animate-fadeIn"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(255, 255, 255, 0.05))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
            minHeight: '280px',
          }}
        >
          {/* Floating orbs */}
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-500/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-pink-400/15 to-orange-400/10 rounded-full blur-lg animate-float-delayed"></div>
          
          <div className="relative z-10 text-center p-6">
            {/* Modern loading indicator */}
            <div className="flex flex-col items-center space-y-6">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-300 rounded-full animate-spin-reverse"></div>
              </div>
              
              <div className="space-y-2">
                <div className="text-blue-700 font-semibold text-lg tracking-wide">
                  Генерируется новая задача
                </div>
                
                {/* Loading dots */}
                <div className="flex justify-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksGrid; 
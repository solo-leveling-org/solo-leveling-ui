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
        <div className="relative overflow-hidden bg-white/60 backdrop-blur-sm rounded-3xl border border-white/30 p-6 flex flex-col items-center justify-center min-h-[200px] shadow-lg">
          {/* Decorative background */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl -translate-y-4 translate-x-4"></div>
          
          <div className="relative z-10 text-center">
            {/* Loading spinner */}
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mb-4 mx-auto"></div>
            
            {/* Loading text */}
            <div className="text-gray-600 font-medium">
              Задача генерируется...
            </div>
            
            {/* Loading dots */}
            <div className="flex justify-center mt-2 space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksGrid; 
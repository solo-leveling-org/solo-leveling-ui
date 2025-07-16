import React from 'react';
import { PlayerTask, PlayerTaskStatus } from '../types';
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
      <div className="tasks-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  return (
    <div className="tasks-grid">
      {visibleTasks.map((playerTask) => (
        <TaskCard
          key={playerTask.id}
          playerTask={playerTask}
          onClick={() => onTaskClick(playerTask)}
          onComplete={playerTask.status === PlayerTaskStatus.IN_PROGRESS ? () => onComplete && onComplete(playerTask) : undefined}
          onReplace={playerTask.status === PlayerTaskStatus.IN_PROGRESS ? () => onReplace && onReplace(playerTask) : undefined}
        />
      ))}
      {loading && (
        <div className="task-card task-card--loader">
          <div className="loader-circle" />
          <div className="loader-text">Задача генерируется...</div>
        </div>
      )}
    </div>
  );
};

export default TasksGrid; 
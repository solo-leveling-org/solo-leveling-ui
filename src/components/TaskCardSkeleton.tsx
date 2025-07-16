import React from 'react';

const TaskCardSkeleton: React.FC = () => (
  <div className="task-card skeleton">
    <div className="task-card-header">
      <span className="skeleton-title skeleton-shimmer" />
      <span className="skeleton-pill skeleton-shimmer" />
    </div>
    <div className="skeleton-desc skeleton-shimmer" />
    <div className="skeleton-desc skeleton-shimmer long" />
    <div className="task-labels">
      <span className="skeleton-label skeleton-shimmer" />
      <span className="skeleton-label skeleton-shimmer" />
    </div>
  </div>
);

export default TaskCardSkeleton; 
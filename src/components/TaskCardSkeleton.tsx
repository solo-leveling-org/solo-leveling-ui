import React from 'react';

const TaskCardSkeleton: React.FC = () => (
  <div className="task-card skeleton">
    <div className="task-card-header">
      <span className="skeleton-title shimmer-effect" />
      <span className="skeleton-pill shimmer-effect" />
    </div>
    <div className="skeleton-desc shimmer-effect" />
    <div className="skeleton-desc shimmer-effect long" />
    <div className="task-labels">
      <span className="skeleton-label shimmer-effect" />
      <span className="skeleton-label shimmer-effect" />
    </div>
  </div>
);

export default TaskCardSkeleton; 
import React from 'react';

const TaskCardSkeleton: React.FC = () => (
  <div className="relative overflow-hidden bg-gradient-to-br from-gray-50/80 to-gray-100/80 backdrop-blur-sm rounded-3xl border border-gray-200/50 p-6 min-h-[200px] shadow-lg shadow-gray-200/30">
    {/* Decorative background */}
    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-300/20 to-gray-400/20 rounded-full blur-xl -translate-y-4 translate-x-4"></div>
    
    <div className="relative z-10 flex flex-col h-full">
      {/* Header skeleton */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div className="h-6 bg-gray-300 rounded-lg w-3/4 animate-pulse"></div>
          <div className="w-4 h-4 bg-gray-300 rounded-full animate-pulse"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded-lg w-full animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded-lg w-5/6 animate-pulse"></div>
        </div>
      </div>

      {/* Topics skeleton */}
      <div className="flex flex-wrap gap-2 mb-4">
        <div className="h-6 bg-gray-300 rounded-full w-20 animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded-full w-24 animate-pulse"></div>
        <div className="h-6 bg-gray-300 rounded-full w-16 animate-pulse"></div>
      </div>

      {/* Rewards skeleton */}
      <div className="flex items-center justify-between mb-4 p-3 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-12 animate-pulse"></div>
        </div>
      </div>

      {/* Status skeleton */}
      <div className="flex items-center justify-between mt-auto">
        <div className="h-6 bg-gray-300 rounded-full w-20 animate-pulse"></div>
      </div>
    </div>

    {/* Shimmer effect overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse"></div>
  </div>
);

export default TaskCardSkeleton; 
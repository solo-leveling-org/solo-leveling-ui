import React from 'react';

const TaskCardSkeleton: React.FC = () => (
  <div 
    className="group relative overflow-hidden cursor-default animate-fadeIn"
    style={{
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25), rgba(255, 255, 255, 0.1))',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.18)',
      borderRadius: '24px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
    }}
  >
    {/* Animated background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-100/20 via-transparent to-slate-200/10 animate-pulse"></div>
    
    {/* Floating orbs */}
    <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-slate-300/30 to-slate-400/20 rounded-full blur-xl animate-float"></div>
    <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-slate-200/20 to-slate-300/10 rounded-full blur-lg animate-float-delayed"></div>
    
    <div className="relative z-10 p-6 min-h-[280px] flex flex-col">
      {/* Rarity indicator skeleton */}
      <div className="absolute top-6 right-6 w-6 h-6 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full animate-pulse"></div>

      {/* Header skeleton */}
      <div className="mb-6">
        <div className="h-7 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-xl mb-3 w-4/5 animate-shimmer"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg w-full animate-shimmer"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg w-5/6 animate-shimmer"></div>
          <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg w-3/4 animate-shimmer"></div>
        </div>
      </div>

      {/* Topics skeleton */}
      <div className="flex flex-wrap gap-2 mb-6">
        <div 
          className="h-7 rounded-full w-24 animate-pulse backdrop-blur-sm border"
          style={{
            background: 'rgba(255, 255, 255, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        ></div>
        <div 
          className="h-7 rounded-full w-20 animate-pulse backdrop-blur-sm border"
          style={{
            background: 'rgba(255, 255, 255, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        ></div>
      </div>

      {/* Rewards skeleton */}
      <div 
        className="flex items-center justify-between mb-6 p-4 rounded-2xl backdrop-blur-sm border"
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
        }}
      >
        <div className="flex items-center space-x-6">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full mr-2 animate-pulse"></div>
            <div className="h-4 bg-slate-300 rounded w-8 animate-pulse"></div>
          </div>
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-300 to-slate-400 rounded-full mr-2 animate-pulse"></div>
            <div className="h-4 bg-slate-300 rounded w-8 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Status skeleton */}
      <div className="flex items-center justify-between mt-auto">
        <div 
          className="h-8 rounded-full w-24 animate-pulse backdrop-blur-sm border"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        ></div>
      </div>
    </div>
  </div>
);

export default TaskCardSkeleton; 
import React from 'react';
import type { PlayerTask } from '../api';
import { PlayerTaskStatus } from '../api';
import { topicIcons } from '../topicMeta';
import RarityIndicator from './RarityIndicator';
import { useLocalization } from '../hooks/useLocalization';

type TaskCardProps = {
  playerTask: PlayerTask;
  onClick: () => void;
  onComplete?: () => void;
  onReplace?: () => void;
  index?: number;
};

const TaskCard: React.FC<TaskCardProps> = ({ playerTask, onClick, onComplete, onReplace, index = 0 }) => {
  const { task, status } = playerTask;
  const { t } = useLocalization();

  // Определяем цветовые схемы для разных статусов с современным glassmorphism подходом
  const getStatusColorScheme = (status: PlayerTaskStatus) => {
    switch (status) {
      case PlayerTaskStatus.PREPARING:
        return {
          bg: 'rgba(255, 255, 255, 0.25)',
          border: 'rgba(255, 255, 255, 0.18)',
          statusColor: 'from-slate-400 to-slate-600',
          accentColor: 'bg-slate-500',
          textColor: 'text-slate-700',
        };
      case PlayerTaskStatus.IN_PROGRESS:
        return {
          bg: 'rgba(59, 130, 246, 0.1)',
          border: 'rgba(59, 130, 246, 0.2)',
          statusColor: 'from-blue-500 to-indigo-600',
          accentColor: 'bg-blue-500',
          textColor: 'text-blue-700',
        };
      case PlayerTaskStatus.PENDING_COMPLETION:
        return {
          bg: 'rgba(34, 197, 94, 0.1)',
          border: 'rgba(34, 197, 94, 0.2)',
          statusColor: 'from-emerald-500 to-green-600',
          accentColor: 'bg-emerald-500',
          textColor: 'text-emerald-700',
        };
      default:
        return {
          bg: 'rgba(255, 255, 255, 0.25)',
          border: 'rgba(255, 255, 255, 0.18)',
          statusColor: 'from-gray-400 to-gray-600',
          accentColor: 'bg-gray-500',
          textColor: 'text-gray-700',
        };
    }
  };



  const colorScheme = getStatusColorScheme(status || PlayerTaskStatus.IN_PROGRESS);

  if (status === PlayerTaskStatus.PREPARING) {
    return (
      <div 
        className="group relative overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] animate-fadeIn"
        onClick={onClick}
        style={{
          background: `linear-gradient(135deg, ${colorScheme.bg}, rgba(255, 255, 255, 0.1))`,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${colorScheme.border}`,
          borderRadius: '24px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          animationDelay: `${index * 150}ms`,
        }}
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-100/20 via-transparent to-slate-200/10 animate-pulse"></div>
        
        {/* Floating orbs */}
        <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-slate-300/30 to-slate-400/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-slate-200/20 to-slate-300/10 rounded-full blur-lg animate-float-delayed"></div>
        
        <div className="relative z-10 p-6 h-[280px] flex flex-col justify-center items-center text-center">
          {/* Elegant skeleton with shimmer */}
          <div className="w-4/5 h-7 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-xl mb-4 animate-shimmer"></div>
          <div className="w-full h-5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg mb-3 animate-shimmer"></div>
          <div className="w-3/4 h-5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg mb-8 animate-shimmer"></div>
          
          {/* Modern loading indicator */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-slate-200 border-t-slate-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-slate-300 rounded-full animate-spin-reverse"></div>
            </div>
            <span className="text-slate-600 font-medium tracking-wide">{t('common.loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="group relative overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:scale-[1.02] animate-fadeIn"
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${colorScheme.bg}, rgba(255, 255, 255, 0.05))`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${colorScheme.border}`,
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
        animationDelay: `${index * 150}ms`,
      }}
    >
      {/* Dynamic background with animated gradients */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
      </div>
      
      {/* Floating orbs */}
      <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-purple-500/10 rounded-full blur-xl animate-float"></div>
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-pink-400/15 to-orange-400/10 rounded-full blur-lg animate-float-delayed"></div>

      {/* Rarity indicator */}
      <div className="absolute top-4 right-4">
        <RarityIndicator 
          rarity={task?.rarity || 'COMMON'} 
          size="sm"
        />
      </div>

      <div className="relative z-10 p-6 min-h-[280px] flex flex-col">
        {/* Header section with proper spacing */}
        <div className="mb-6 pr-10">
          <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight tracking-tight">
            {task?.title || ''}
          </h3>
          <p className="text-gray-700 leading-relaxed line-clamp-3 text-sm font-medium">
            {task?.description || ''}
          </p>
        </div>

        {/* Topics with modern pill design */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(task?.topics || []).slice(0, 2).map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-sm border"
              style={{
                background: 'rgba(255, 255, 255, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#374151',
              }}
            >
              <span className="mr-1.5 text-sm">{topicIcons[topic] || '❓'}</span>
                                      {t(`topics.labels.${topic}`)}
            </span>
          ))}
          {(task?.topics || []).length > 2 && (
            <span 
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-sm border"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#6B7280',
              }}
            >
              +{(task?.topics || []).length - 2}
            </span>
          )}
        </div>



        {/* Status indicator as subtle bar */}
        <div className="mt-auto">
          <div 
            className="h-1 w-full rounded-full mb-4"
            style={{
              background: colorScheme.bg.replace('0.1', '0.3'),
            }}
          ></div>

          {/* Modern action buttons */}
          {status === PlayerTaskStatus.IN_PROGRESS && onComplete && onReplace && (
            <div className="flex items-center justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete();
                }}
                className="relative overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 text-emerald-600 rounded-full px-4 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-emerald-50/30"
                title="Завершить задачу"
              >
                <span className="relative z-10">Готово</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReplace();
                }}
                className="relative overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 text-blue-600 rounded-full px-4 py-2 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-blue-50/30"
                title="Заменить задачу"
              >
                <span className="relative z-10">Заменить</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 
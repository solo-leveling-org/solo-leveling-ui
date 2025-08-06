import React from 'react';
import type { PlayerTask } from '../api';
import { PlayerTaskStatus } from '../api';
import { ReactComponent as DoneIcon } from '../assets/icons/done.svg';
import { ReactComponent as RefreshIcon } from '../assets/icons/refresh.svg';
import { topicIcons, topicLabels } from '../topicMeta';

type TaskCardProps = {
  playerTask: PlayerTask;
  onClick: () => void;
  onComplete?: () => void;
  onReplace?: () => void;
  index?: number;
};

const TaskCard: React.FC<TaskCardProps> = ({ playerTask, onClick, onComplete, onReplace, index = 0 }) => {
  const { task, status } = playerTask;

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

  // Современные цвета редкости с яркими градиентами
  const getRarityGradient = (rarity: string) => {
    const rarityGradients = {
      COMMON: 'from-slate-400 via-slate-500 to-slate-600',
      UNCOMMON: 'from-emerald-400 via-green-500 to-emerald-600',
      RARE: 'from-blue-400 via-blue-500 to-indigo-600',
      EPIC: 'from-purple-400 via-violet-500 to-purple-600',
      LEGENDARY: 'from-amber-400 via-orange-500 to-red-500',
    };
    return rarityGradients[rarity as keyof typeof rarityGradients] || rarityGradients.COMMON;
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
            <span className="text-slate-600 font-medium tracking-wide">Создается...</span>
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
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${getRarityGradient(task?.rarity || 'COMMON')} flex items-center justify-center shadow-lg`}>
          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 p-6 min-h-[280px] flex flex-col">
        {/* Header section */}
        <div className="mb-6">
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
              {topicLabels[topic] || topic}
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

        {/* Rewards section with glassmorphism */}
        <div 
          className="flex items-center justify-between mb-6 p-4 rounded-2xl backdrop-blur-sm border"
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
        >
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center mr-2 shadow-md">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
              <span className="font-bold text-gray-800 text-sm">{task?.experience || 0}</span>
            </div>
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-green-500 rounded-lg flex items-center justify-center mr-2 shadow-md">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <span className="font-bold text-gray-800 text-sm">{task?.currencyReward || 0}</span>
            </div>
          </div>
        </div>

        {/* Status and actions */}
        <div className="flex items-center justify-between mt-auto pt-4">
          <div className="flex items-center">
            {status === PlayerTaskStatus.IN_PROGRESS && (
              <div 
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border ${colorScheme.textColor}`}
                style={{
                  background: 'rgba(59, 130, 246, 0.15)',
                  border: '1px solid rgba(59, 130, 246, 0.2)',
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Активна
              </div>
            )}
            {status === PlayerTaskStatus.PENDING_COMPLETION && (
              <div 
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border ${colorScheme.textColor}`}
                style={{
                  background: 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Готово к проверке
              </div>
            )}
            {status === PlayerTaskStatus.COMPLETED && (
              <div 
                className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border ${colorScheme.textColor}`}
                style={{
                  background: 'rgba(156, 163, 175, 0.15)',
                  border: '1px solid rgba(156, 163, 175, 0.2)',
                }}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Завершена
              </div>
            )}
          </div>

          {/* Action buttons - показываем для всех активных задач */}
          {status === PlayerTaskStatus.IN_PROGRESS && onComplete && onReplace && (
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete();
                }}
                className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                title="Завершить задачу"
              >
                <DoneIcon width={16} height={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReplace();
                }}
                className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                title="Заменить задачу"
              >
                <RefreshIcon width={16} height={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard; 
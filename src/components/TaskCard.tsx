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

  // Определяем цветовые схемы для разных статусов
  const getStatusColorScheme = (status: PlayerTaskStatus) => {
    switch (status) {
      case PlayerTaskStatus.PREPARING:
        return {
          bg: 'from-gray-50/90 to-gray-100/90',
          border: 'border-gray-200/50',
          glow: 'shadow-gray-200/30',
        };
      case PlayerTaskStatus.IN_PROGRESS:
        return {
          bg: 'from-blue-50/90 to-indigo-50/90',
          border: 'border-blue-200/50',
          glow: 'shadow-blue-200/30',
        };
      case PlayerTaskStatus.PENDING_COMPLETION:
        return {
          bg: 'from-green-50/90 to-emerald-50/90',
          border: 'border-green-200/50',
          glow: 'shadow-green-200/30',
        };
      default:
        return {
          bg: 'from-white/90 to-gray-50/90',
          border: 'border-gray-200/50',
          glow: 'shadow-gray-200/30',
        };
    }
  };

  // Определяем цвет редкости
  const getRarityColor = (rarity: string) => {
    const rarityColors = {
      COMMON: 'from-gray-400 to-gray-500',
      UNCOMMON: 'from-green-400 to-green-500',
      RARE: 'from-blue-400 to-blue-500',
      EPIC: 'from-purple-400 to-purple-500',
      LEGENDARY: 'from-yellow-400 to-orange-500',
    };
    return rarityColors[rarity as keyof typeof rarityColors] || rarityColors.COMMON;
  };

  const colorScheme = getStatusColorScheme(status || PlayerTaskStatus.IN_PROGRESS);

  if (status === PlayerTaskStatus.PREPARING) {
    return (
      <div 
        className={`relative overflow-hidden bg-gradient-to-br ${colorScheme.bg} backdrop-blur-sm rounded-3xl border ${colorScheme.border} p-6 min-h-[200px] shadow-lg ${colorScheme.glow} cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
        onClick={onClick}
        style={{
          animationDelay: `${index * 100}ms`,
        }}
      >
        {/* Decorative background */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-300/20 to-gray-400/20 rounded-full blur-xl -translate-y-4 translate-x-4"></div>
        
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-center">
          {/* Skeleton elements */}
          <div className="w-3/4 h-6 bg-gray-300 rounded-lg mb-4 animate-pulse"></div>
          <div className="w-full h-4 bg-gray-300 rounded-lg mb-2 animate-pulse"></div>
          <div className="w-5/6 h-4 bg-gray-300 rounded-lg mb-6 animate-pulse"></div>
          
          {/* Status indicator */}
          <div className="inline-flex items-center px-4 py-2 bg-gray-400/20 rounded-full">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
            <span className="text-gray-600 font-medium">Генерируется...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group relative overflow-hidden bg-gradient-to-br ${colorScheme.bg} backdrop-blur-sm rounded-3xl border ${colorScheme.border} p-6 min-h-[200px] shadow-lg ${colorScheme.glow} cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl`}
      onClick={onClick}
      style={{
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-xl -translate-y-4 translate-x-4"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-400/10 to-orange-400/10 rounded-full blur-lg translate-y-2 -translate-x-2"></div>

      {/* Rarity indicator */}
      <div className={`absolute top-4 right-4 w-4 h-4 bg-gradient-to-r ${getRarityColor(task?.rarity || 'COMMON')} rounded-full shadow-lg`}></div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 mb-2 leading-tight">
            {task?.title || ''}
          </h3>
          <p className="text-gray-600 leading-relaxed line-clamp-3">
            {task?.description || ''}
          </p>
        </div>

        {/* Topics */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(task?.topics || []).slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-700 border border-white/30"
            >
              <span className="mr-1">{topicIcons[topic] || '❓'}</span>
              {topicLabels[topic] || topic}
            </span>
          ))}
          {(task?.topics || []).length > 3 && (
            <span className="inline-flex items-center px-3 py-1 bg-white/60 backdrop-blur-sm rounded-full text-sm font-medium text-gray-500 border border-white/30">
              +{(task?.topics || []).length - 3}
            </span>
          )}
        </div>

        {/* Rewards */}
        <div className="flex items-center justify-between mb-4 p-3 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/30">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center">
              <span className="text-yellow-500 mr-1">⭐</span>
              <span className="font-semibold text-gray-700">{task?.experience || 0} XP</span>
            </div>
            <div className="flex items-center">
              <span className="text-green-500 mr-1">💰</span>
              <span className="font-semibold text-gray-700">{task?.currencyReward || 0}</span>
            </div>
          </div>
        </div>

        {/* Status indicator */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center">
            {status === PlayerTaskStatus.IN_PROGRESS && (
              <div className="inline-flex items-center px-3 py-1 bg-blue-500/20 text-blue-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2"></div>
                В процессе
              </div>
            )}
            {status === PlayerTaskStatus.PENDING_COMPLETION && (
              <div className="inline-flex items-center px-3 py-1 bg-green-500/20 text-green-700 rounded-full text-sm font-medium">
                <span className="mr-1">✅</span>
                Готово к проверке
              </div>
            )}
          </div>

          {/* Action buttons */}
          {status === PlayerTaskStatus.IN_PROGRESS && (
            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete && onComplete();
                }}
                className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
                title="Завершить задачу"
              >
                <DoneIcon width={20} height={20} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReplace && onReplace();
                }}
                className="flex items-center justify-center w-10 h-10 bg-blue-500 hover:bg-blue-600 text-white rounded-full transition-colors duration-200 shadow-lg hover:shadow-xl"
                title="Заменить задачу"
              >
                <RefreshIcon width={20} height={20} />
              </button>
            </div>
          )}
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};

export default TaskCard; 
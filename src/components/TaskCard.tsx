import React, { useMemo } from 'react';
import type { PlayerTask } from '../api';
import { PlayerTaskStatus } from '../api';
import TopicIcon from './TopicIcons';
import RarityIndicator from './RarityIndicator';
import Icon from './Icon';
import { useLocalization } from '../hooks/useLocalization';

type TaskCardProps = {
  playerTask: PlayerTask;
  onClick: () => void;
  onComplete?: () => void;
  onReplace?: () => void;
  index?: number;
};

// Определяем цветовые схемы для разных статусов в стилистике Solo Leveling (вынесено наружу для оптимизации)
const getStatusColorScheme = (status: PlayerTaskStatus) => {
    switch (status) {
      case PlayerTaskStatus.PREPARING:
        return {
          bg: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
          border: 'rgba(220, 235, 245, 0.15)',
          accentColor: 'rgba(220, 235, 245, 0.3)',
          textColor: '#e8f4f8',
        };
      case PlayerTaskStatus.IN_PROGRESS:
        return {
          bg: 'linear-gradient(135deg, rgba(10, 14, 39, 0.9) 0%, rgba(5, 8, 18, 0.95) 100%)',
          border: 'rgba(180, 220, 240, 0.3)',
          accentColor: 'rgba(180, 220, 240, 0.4)',
          textColor: '#e8f4f8',
        };
      case PlayerTaskStatus.COMPLETED:
        return {
          bg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
          border: 'rgba(34, 197, 94, 0.3)',
          accentColor: 'rgba(34, 197, 94, 0.5)',
          textColor: 'rgba(220, 235, 245, 0.6)',
        };
      case PlayerTaskStatus.SKIPPED:
        return {
          bg: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%)',
          border: 'rgba(220, 38, 38, 0.3)',
          accentColor: 'rgba(220, 38, 38, 0.5)',
          textColor: 'rgba(220, 235, 245, 0.6)',
        };
      default:
        return {
          bg: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
          border: 'rgba(220, 235, 245, 0.2)',
          accentColor: 'rgba(220, 235, 245, 0.3)',
          textColor: '#e8f4f8',
        };
    }
  };

const TaskCard: React.FC<TaskCardProps> = ({ playerTask, onClick, onComplete, onReplace, index = 0 }) => {
  const { task, status } = playerTask;
  const { t } = useLocalization();
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  
  // Отслеживаем переход из PREPARING в IN_PROGRESS
  React.useEffect(() => {
    if (status === PlayerTaskStatus.IN_PROGRESS) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 600);
      return () => clearTimeout(timer);
    }
  }, [status]);

  // Мемоизируем цветовую схему
  const colorScheme = useMemo(() => getStatusColorScheme(status || PlayerTaskStatus.IN_PROGRESS), [status]);

  // Мемоизируем стили для карточки
  const cardStyle = useMemo(() => ({
    background: colorScheme.bg,
    border: `2px solid ${colorScheme.border}`,
    borderRadius: '24px',
    boxShadow: status === PlayerTaskStatus.COMPLETED
      ? `0 0 12px rgba(34, 197, 94, 0.2)`
      : status === PlayerTaskStatus.SKIPPED
      ? `0 0 12px rgba(220, 38, 38, 0.2)`
      : `0 0 12px rgba(180, 220, 240, 0.15)`,
    animationDelay: `${index * 150}ms`,
  }), [colorScheme, status, index]);
  
  // Мемоизируем стили для текста
  const titleStyle = useMemo(() => ({
    color: colorScheme.textColor,
    textShadow: status === PlayerTaskStatus.COMPLETED
      ? '0 0 4px rgba(34, 197, 94, 0.2)'
      : status === PlayerTaskStatus.SKIPPED
      ? '0 0 4px rgba(220, 38, 38, 0.2)'
      : '0 0 4px rgba(180, 220, 240, 0.2)'
  }), [colorScheme.textColor, status]);

  if (status === PlayerTaskStatus.PREPARING) {
    return (
      <div 
        className="group relative overflow-hidden cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.02] animate-fadeIn"
        onClick={onClick}
        style={{
          background: colorScheme.bg,
          border: `2px solid ${colorScheme.border}`,
          borderRadius: '24px',
          boxShadow: `0 0 12px rgba(180, 220, 240, 0.15)`,
          animationDelay: `${index * 150}ms`,
        }}
      >
        {/* Glowing orbs */}
        <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full blur-xl opacity-10 animate-float" style={{
          background: 'rgba(180, 216, 232, 0.8)'
        }}></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full blur-lg opacity-10 animate-float-delayed" style={{
          background: 'rgba(200, 230, 245, 0.6)'
        }}></div>
        
        <div className="relative z-10 p-6 h-[280px] flex flex-col justify-center items-center text-center">
          {/* Elegant skeleton with shimmer */}
          <div 
            className="w-4/5 h-7 rounded-xl mb-4 animate-pulse"
            style={{
              background: 'rgba(220, 235, 245, 0.1)'
            }}
          ></div>
          <div 
            className="w-full h-5 rounded-lg mb-3 animate-pulse"
            style={{
              background: 'rgba(220, 235, 245, 0.1)'
            }}
          ></div>
          <div 
            className="w-3/4 h-5 rounded-lg mb-8 animate-pulse"
            style={{
              background: 'rgba(220, 235, 245, 0.1)'
            }}
          ></div>
          
          {/* Modern loading indicator */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div 
                className="w-12 h-12 border-4 rounded-full animate-spin"
                style={{
                  borderColor: 'rgba(220, 235, 245, 0.2)',
                  borderTopColor: 'rgba(180, 220, 240, 0.6)'
                }}
              ></div>
              <div 
                className="absolute inset-0 w-12 h-12 border-4 border-transparent rounded-full animate-spin-reverse"
                style={{
                  borderRightColor: 'rgba(200, 230, 245, 0.4)'
                }}
              ></div>
            </div>
            <span 
              className="font-tech font-medium tracking-wide"
              style={{
                color: 'rgba(220, 235, 245, 0.7)'
              }}
            >
              {t('taskCard.generating')}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`group relative overflow-hidden cursor-pointer transition-transform duration-500 ease-out hover:scale-[1.02] animate-fadeIn h-full flex flex-col ${isTransitioning ? 'task-status-transition' : ''}`}
      onClick={onClick}
      key={`${playerTask.id}-${status}`}
      style={cardStyle}
    >
      {/* Simplified - removed heavy animated effects for performance */}


      {/* Rarity indicator */}
      <div className="absolute top-4 right-4 z-20">
        <RarityIndicator 
          rarity={task?.rarity || 'COMMON'} 
          size="sm"
        />
      </div>

      <div className="relative z-10 p-6 min-h-[280px] h-full flex flex-col">
        {/* Header section with proper spacing */}
        <div className="mb-6 flex-grow">
          {/* Title with smart padding - only first 2 lines have right padding */}
          <div className="mb-3" style={{ position: 'relative' }}>
            {/* Floating element that creates space only for first 2 lines */}
            <div 
              style={{
                float: 'right',
                width: '120px',
                height: 'calc(1.25rem * 2.5)',
                shapeOutside: 'inset(0)',
              }}
            ></div>
            <h3 
              className="text-xl font-tech font-bold leading-tight tracking-tight" 
              data-text="true"
              style={{
                ...titleStyle,
                wordBreak: 'break-word',
              }}
            >
              {task?.title || ''}
            </h3>
            <div style={{ clear: 'both' }}></div>
          </div>
          <p 
            className="leading-relaxed line-clamp-3 text-sm font-medium" 
            data-text="true"
            style={{
              color: colorScheme.textColor
            }}
          >
            {task?.description || ''}
          </p>
        </div>

        {/* Topics with modern pill design */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(task?.topics || []).slice(0, 2).map((topic) => (
            <span
              key={topic}
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-tech font-semibold tracking-wide backdrop-blur-sm border"
              style={{
                background: 'rgba(220, 235, 245, 0.1)',
                border: '1px solid rgba(220, 235, 245, 0.2)',
                color: '#e8f4f8',
              }}
            >
              <TopicIcon topic={topic} size={16} className="mr-1.5 text-sm" />
              <span data-text="true">{t(`topics.labels.${topic}`)}</span>
            </span>
          ))}
          {(task?.topics || []).length > 2 && (
            <span 
              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-tech font-semibold tracking-wide backdrop-blur-sm border"
              style={{
                background: 'rgba(220, 235, 245, 0.08)',
                border: '1px solid rgba(220, 235, 245, 0.15)',
                color: 'rgba(220, 235, 245, 0.6)',
              }}
            >
              <span data-text="true">+{(task?.topics || []).length - 2}</span>
            </span>
          )}
        </div>

        {/* Fixed bottom section with status bar and buttons */}
        <div className="mt-auto pt-4">
          {/* Status indicator as full-width light bar */}
          <div 
            className="h-1 w-full rounded-full mb-4"
            style={{
              background: colorScheme.accentColor,
              boxShadow: `0 0 8px ${colorScheme.accentColor}`
            }}
          ></div>

          {/* Action buttons - fixed at bottom */}
          {status === PlayerTaskStatus.IN_PROGRESS && onComplete && onReplace && (
            <div className="flex items-center justify-end gap-2">
              {/* Complete button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onComplete();
                }}
                className="group relative w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(5, 8, 18, 0.98) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(160, 210, 235, 0.4)',
                  boxShadow: '0 0 15px rgba(160, 210, 235, 0.3)'
                }}
                title={t('taskCard.complete')}
              >
                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle, rgba(160, 210, 235, 0.3) 0%, transparent 70%)',
                    filter: 'blur(8px)'
                  }}
                ></div>
                <div className="relative z-10" style={{ color: 'rgba(160, 210, 235, 0.9)' }}>
                  <Icon type="check" size={16} />
                </div>
              </button>

              {/* Replace button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReplace();
                }}
                className="group relative w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-transform duration-300 hover:scale-110 active:scale-95"
                style={{
                  background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(5, 8, 18, 0.98) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '2px solid rgba(180, 220, 240, 0.4)',
                  boxShadow: '0 0 15px rgba(180, 220, 240, 0.3)'
                }}
                title={t('taskCard.replace')}
              >
                {/* Hover glow effect */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle, rgba(180, 220, 240, 0.3) 0%, transparent 70%)',
                    filter: 'blur(8px)'
                  }}
                ></div>
                <div className="relative z-10 transition-transform duration-300 group-hover:scale-110" style={{ color: 'rgba(180, 220, 240, 0.9)' }}>
                  <Icon type="arrow-left-right" size={16} />
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskCard, (prevProps, nextProps) => {
  // Кастомная функция сравнения для оптимизации
  return (
    prevProps.playerTask.id === nextProps.playerTask.id &&
    prevProps.playerTask.status === nextProps.playerTask.status &&
    prevProps.index === nextProps.index
  );
}); 
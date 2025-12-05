import React, { useMemo } from 'react';
import type {Task, PlayerTaskStatus} from '../api';
import { PlayerTaskStatus as TaskStatus } from '../api';
import TopicIcon from './TopicIcons';
import Icon from './Icon';
import RarityIndicator from './RarityIndicator';
import { useLocalization } from '../hooks/useLocalization';
import { Card } from './ui/card';
import BaseDialog from './BaseDialog';
import { getMonthGenitive } from '../utils';

type TaskDialogProps = {
  task: Task;
  status?: PlayerTaskStatus;
  createdAt?: string;
  onClose: () => void;
  isOpen: boolean;
};

// Определяем цветовые схемы для разных статусов (из TaskCard.tsx)
const getStatusColorScheme = (status?: PlayerTaskStatus) => {
  if (!status) {
    return {
      bg: 'linear-gradient(135deg, rgba(10, 14, 39, 1) 0%, rgba(5, 8, 18, 1) 100%)',
      border: 'rgba(220, 235, 245, 0.2)',
    };
  }
  
  switch (status) {
    case TaskStatus.COMPLETED:
      return {
        bg: 'linear-gradient(135deg, rgba(10, 14, 39, 1) 0%, rgba(5, 8, 18, 1) 100%), linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.1) 100%)',
        border: 'rgba(34, 197, 94, 0.3)',
        innerBg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(22, 163, 74, 0.05) 100%)',
        innerBorder: 'rgba(34, 197, 94, 0.2)',
      };
    case TaskStatus.SKIPPED:
      return {
        bg: 'linear-gradient(135deg, rgba(10, 14, 39, 1) 0%, rgba(5, 8, 18, 1) 100%), linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(185, 28, 28, 0.1) 100%)',
        border: 'rgba(220, 38, 38, 0.3)',
        innerBg: 'linear-gradient(135deg, rgba(220, 38, 38, 0.08) 0%, rgba(185, 28, 28, 0.05) 100%)',
        innerBorder: 'rgba(220, 38, 38, 0.2)',
      };
    default:
      return {
        bg: 'linear-gradient(135deg, rgba(10, 14, 39, 1) 0%, rgba(5, 8, 18, 1) 100%)',
        border: 'rgba(220, 235, 245, 0.2)',
        innerBg: 'rgba(220, 235, 245, 0.05)',
        innerBorder: 'rgba(220, 235, 245, 0.15)',
      };
  }
};

const TaskDialog: React.FC<TaskDialogProps> = ({task, status, createdAt, onClose, isOpen}) => {
  const { t, currentLanguage } = useLocalization();

  // Форматирование даты создания
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // Сегодня
    if (taskDate.getTime() === today.getTime()) {
      return t('common.today');
    }
    
    // Вчера
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (taskDate.getTime() === yesterday.getTime()) {
      return t('common.yesterday');
    }
    
    // Форматируем дату
    const day = date.getDate();
    const monthName = getMonthGenitive(date.getMonth(), t, currentLanguage || 'ru');
    const year = date.getFullYear();
    const currentYear = now.getFullYear();
    
    if (year === currentYear) {
      return `${day} ${monthName}`;
    }
    
    return `${day} ${monthName} ${year}`;
  };

  // Форматирование времени
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Мемоизируем стили для оптимизации
  const rarityText = useMemo(() => t(`rarity.${task.rarity || 'COMMON'}`), [t, task.rarity]);
  
  // Получаем цветовую схему на основе статуса
  const colorScheme = useMemo(() => getStatusColorScheme(status), [status]);
  
  // Определяем boxShadow на основе статуса
  const dialogBoxShadow = useMemo(() => {
    if (status === TaskStatus.COMPLETED) {
      return '0 0 30px rgba(34, 197, 94, 0.2), inset 0 0 30px rgba(200, 230, 245, 0.03)';
    } else if (status === TaskStatus.SKIPPED) {
      return '0 0 30px rgba(220, 38, 38, 0.2), inset 0 0 30px rgba(200, 230, 245, 0.03)';
    }
    return '0 0 30px rgba(180, 220, 240, 0.2), inset 0 0 30px rgba(200, 230, 245, 0.03)';
  }, [status]);

  return (
    <BaseDialog
      isTaskDialog={true}
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      maxHeight="max-h-[calc(95vh-env(safe-area-inset-top,0px)-5rem)]"
      contentClassName="task-dialog-content"
    >
        <style>{`
          .profile-icon-wrapper svg {
            color: inherit;
            fill: none;
            stroke: currentColor;
          }
        .task-dialog-content {
          background: ${colorScheme.bg} !important;
          border: 2px solid ${colorScheme.border} !important;
          box-shadow: ${dialogBoxShadow} !important;
        }
        `}</style>

        <div className="flex flex-col h-full min-h-0">
            {/* Header */}
          <div className="relative z-10 p-6 pb-4 border-b flex-shrink-0" style={{
              borderColor: 'rgba(220, 235, 245, 0.1)'
            }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-4">
                  <h2 
                    className="text-xl font-tech font-bold leading-tight mb-3"
                    style={{
                      color: '#e8f4f8',
                      textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
                    }}
                  >
                    {task.title}
                  </h2>
                  
                  {/* Rarity indicator - integrated with title */}
                  <div className="flex items-center gap-2">
                    <RarityIndicator 
                      rarity={task.rarity || 'COMMON'} 
                      size="sm"
                      showLabel={false}
                    />
                    <span 
                      className="text-xs font-tech font-semibold px-2 py-1 rounded-full border"
                      style={{
                        background: 'rgba(220, 235, 245, 0.1)',
                        borderColor: 'rgba(220, 235, 245, 0.2)',
                        color: '#e8f4f8',
                        textShadow: '0 0 4px rgba(180, 220, 240, 0.2)'
                      }}
                    >
                      {rarityText}
                    </span>
                  </div>
                </div>

                {/* Close button */}
                <button
              onClick={onClose}
                    className="flex items-center justify-center w-8 h-8 rounded-lg transition-opacity duration-200 group"
                    style={{
                      background: 'rgba(220, 235, 245, 0.05)',
                      border: '1px solid rgba(220, 235, 245, 0.2)',
                      color: '#e8f4f8'
                    }}
                >
                  <svg className="w-4 h-4 transition-colors group-hover:text-white"
                       fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Scrollable content */}
          <div className="relative z-10 px-6 pb-6 overflow-y-auto overflow-x-hidden flex-1 min-h-0">
              {/* Description */}
              <div
                  className="rounded-2xl p-4 mb-6 border"
                  style={{
                    background: 'rgba(220, 235, 245, 0.05)',
                    borderColor: 'rgba(220, 235, 245, 0.15)'
                  }}
              >
                <p 
                  className="leading-relaxed text-sm"
                  style={{
                    color: 'rgba(220, 235, 245, 0.8)'
                  }}
                >
                  {task.description}
                </p>
              </div>

              {/* Rewards section */}
              <div className="mb-6">
                <h3 
                  className="text-sm font-tech font-semibold mb-3 flex items-center"
                  style={{
                    color: '#e8f4f8',
                    textShadow: '0 0 4px rgba(180, 220, 240, 0.2)'
                  }}
                >
                  <div className="mr-2" style={{ color: 'rgba(180, 220, 240, 0.8)' }}>
                    <Icon type="sparkles" size={16} />
                  </div>
                  {t('dialogs.task.rewardsTitle')}
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div
                      className="rounded-xl p-3 border text-center"
                      style={{
                        background: 'rgba(220, 235, 245, 0.05)',
                        borderColor: 'rgba(220, 235, 245, 0.2)'
                      }}
                  >
                    <div className="flex justify-center items-center mb-2" style={{ color: 'rgba(180, 220, 240, 0.8)' }}>
                      <Icon type="star" size={24} />
                    </div>
                    <div 
                      className="text-lg font-tech font-bold"
                      style={{ color: '#e8f4f8' }}
                    >
                      {task.experience || 0}
                    </div>
                    <div 
                      className="text-xs font-tech font-medium"
                      style={{ color: 'rgba(220, 235, 245, 0.7)' }}
                    >
                      {t('dialogs.task.experience')}
                    </div>
                  </div>
                  <div
                      className="rounded-xl p-3 border text-center"
                      style={{
                        background: 'rgba(220, 235, 245, 0.05)',
                        borderColor: 'rgba(220, 235, 245, 0.2)'
                      }}
                  >
                    <div className="flex justify-center items-center mb-2" style={{ color: 'rgba(180, 220, 240, 0.8)' }}>
                      <Icon type="coins" size={24} />
                    </div>
                    <div 
                      className="text-lg font-tech font-bold"
                      style={{ color: '#e8f4f8' }}
                    >
                      {task.currencyReward || 0}
                    </div>
                    <div 
                      className="text-xs font-tech font-medium"
                      style={{ color: 'rgba(220, 235, 245, 0.7)' }}
                    >
                      {t('dialogs.task.coins')}
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats section */}
              <div className="mb-6">
                <h3 
                  className="text-sm font-tech font-semibold mb-3 flex items-center"
                  style={{
                    color: '#e8f4f8',
                    textShadow: '0 0 4px rgba(180, 220, 240, 0.2)'
                  }}
                >
                  <div className="mr-2" style={{ color: 'rgba(180, 220, 240, 0.8)' }}>
                    <Icon type="clock" size={16} />
                  </div>
                  {t('dialogs.task.statsTitle')}
                </h3>
                <div className="grid grid-cols-3 gap-3 md:gap-4 items-stretch">
                  {/* Strength */}
                  <Card 
                    className="border-0 shadow-none bg-transparent text-center p-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%)',
                      border: '1px solid rgba(220, 38, 38, 0.2)',
                      boxShadow: '0 0 15px rgba(220, 38, 38, 0.1)'
                    }}
                  >
                    <div className="flex justify-center items-center mb-2">
                      <div
                        className="profile-icon-wrapper"
                        style={{
                          color: '#e8f4f8',
                          filter: 'drop-shadow(0 0 8px rgba(220, 38, 38, 0.6))'
                        }}
                      >
                        <Icon type="dumbbell" size={28} />
                      </div>
                    </div>
                    <div 
                      className="text-xl md:text-2xl font-tech font-bold mb-1"
                      style={{
                        color: '#e8f4f8',
                        textShadow: '0 0 8px rgba(220, 38, 38, 0.4)'
                      }}
                    >
                      {task.strength || 0}
                    </div>
                    <div 
                      className="text-[10px] md:text-xs font-tech"
                      style={{ color: 'rgba(220, 235, 245, 0.7)' }}
                    >
                      {t('profile.stats.strength')}
                    </div>
                  </Card>

                  {/* Agility */}
                  <Card 
                    className="border-0 shadow-none bg-transparent text-center p-4"
                    style={{
                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                      border: '1px solid rgba(34, 197, 94, 0.2)',
                      boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)'
                    }}
                  >
                    <div className="flex justify-center items-center mb-2">
                      <div
                        className="profile-icon-wrapper"
                        style={{
                          color: '#e8f4f8',
                          filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))'
                        }}
                      >
                        <Icon type="zap" size={28} />
                      </div>
                    </div>
                    <div 
                      className="text-xl md:text-2xl font-tech font-bold mb-1"
                      style={{
                        color: '#e8f4f8',
                        textShadow: '0 0 8px rgba(34, 197, 94, 0.4)'
                      }}
                    >
                      {task.agility || 0}
                    </div>
                    <div 
                      className="text-[10px] md:text-xs font-tech"
                      style={{ color: 'rgba(220, 235, 245, 0.7)' }}
                    >
                      {t('profile.stats.agility')}
                    </div>
                  </Card>

                  {/* Intelligence */}
                  <Card 
                    className="border-0 shadow-none bg-transparent text-center p-4 flex flex-col items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      boxShadow: '0 0 15px rgba(168, 85, 247, 0.1)'
                    }}
                  >
                    <div className="flex justify-center items-center mb-2">
                      <div
                        className="profile-icon-wrapper"
                        style={{
                          color: '#e8f4f8',
                          filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))'
                        }}
                      >
                        <Icon type="brain" size={28} />
                      </div>
                    </div>
                    <div 
                      className="text-xl md:text-2xl font-tech font-bold mb-1"
                      style={{
                        color: '#e8f4f8',
                        textShadow: '0 0 8px rgba(168, 85, 247, 0.4)'
                      }}
                    >
                      {task.intelligence || 0}
                    </div>
                    <div 
                      className="text-[10px] md:text-xs font-tech text-center"
                      style={{ color: 'rgba(220, 235, 245, 0.7)' }}
                    >
                      {t('profile.stats.intelligence')}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Topics section */}
              {task.topics && task.topics.length > 0 && (
                  <div className="mb-4">
                    <h3 
                      className="text-sm font-tech font-semibold mb-3 flex items-center"
                      style={{
                        color: '#e8f4f8',
                        textShadow: '0 0 4px rgba(180, 220, 240, 0.2)'
                      }}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'rgba(180, 220, 240, 0.8)' }}>
                        <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                      </svg>
                      {t('dialogs.task.categoriesTitle')}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {task.topics.map((topic, index) => (
                          <div
                              key={topic}
                              className="inline-flex items-center px-3 py-2 rounded-full text-xs font-tech font-medium border"
                              style={{
                                background: 'rgba(220, 235, 245, 0.1)',
                                borderColor: 'rgba(220, 235, 245, 0.2)',
                                color: '#e8f4f8'
                              }}
                          >
                            <TopicIcon topic={topic} size={16} className="mr-1" />
                            {t(`topics.labels.${topic}`)}
                          </div>
                      ))}
                    </div>
                  </div>
              )}

              {/* Created date section */}
              {createdAt && (
                <div className="mb-4 flex items-center gap-2">
                  <div style={{ color: 'rgba(180, 220, 240, 0.8)' }}>
                    <Icon type="clock" size={16} />
                  </div>
                  <div>
                    <div 
                      className="text-xs font-tech font-medium mb-1"
                      style={{ color: 'rgba(220, 235, 245, 0.7)' }}
                    >
                      {t('dialogs.task.createdAt')}
                    </div>
                    <div 
                      className="text-sm font-tech font-semibold"
                      style={{ color: '#e8f4f8' }}
                    >
                      {formatDate(createdAt)} {formatTime(createdAt)}
                    </div>
                  </div>
                </div>
              )}
          </div>
            </div>
    </BaseDialog>
  );
};

// Мемоизируем компонент для оптимизации рендеринга
export default React.memo(TaskDialog);
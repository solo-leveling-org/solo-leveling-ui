import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import type { CompleteTaskResponse, Task } from '../api';
import { useLocalization } from '../hooks/useLocalization';
import { useModal } from '../contexts/ModalContext';
import { useScrollLock } from '../hooks/useScrollLock';
import Icon from './Icon';
import TopicIcon from './TopicIcons';


type TaskCompletionDialogProps = {
  response: CompleteTaskResponse;
  completedTask?: Task; // Добавляем задачу, которую выполнил пользователь
  onClose: () => void;
};

const TaskCompletionDialog: React.FC<TaskCompletionDialogProps> = ({ response, completedTask, onClose }) => {
  const { playerBefore, playerAfter } = response;
  const { t } = useLocalization();
  const { openDialog, closeDialog } = useModal();

  // Блокируем скролл фонового контента при открытии диалога
  useEffect(() => {
    openDialog();
    return () => {
      closeDialog();
    };
  }, [openDialog, closeDialog]);

  // Используем хук для блокировки скролла
  useScrollLock(true);

  const handleClose = () => {
    closeDialog();
    onClose();
  };

  if (!playerBefore || !playerAfter) {
    return null;
  }

  // Вычисляем изменения
  const expChange = completedTask?.experience || 0; // Опыт из выполненной задачи
  const strengthChange = (playerAfter.strength || 0) - (playerBefore.strength || 0);
  const agilityChange = (playerAfter.agility || 0) - (playerBefore.agility || 0);
  const intelligenceChange = (playerAfter.intelligence || 0) - (playerBefore.intelligence || 0);
  const balanceChange = completedTask?.currencyReward || 0; // Награда из выполненной задачи
  

  
  // Получаем прогресс по топикам из реального контракта
  const topicProgress = playerAfter.taskTopics || [];

  // Показываем прогресс только по тем топикам, которые были у выполненной задачи
  const topicsInTask = new Set(completedTask?.topics || []);
  const filteredTopicProgress = topicProgress.filter(tp => tp.taskTopic && topicsInTask.has(tp.taskTopic));
  const perTopicExpGain = (completedTask?.topics && completedTask.topics.length > 0)
    ? Math.floor((completedTask?.experience || 0) / completedTask.topics.length)
    : 0;

  // Карта уровней по темам ДО выполнения задачи для вычисления изменения уровня топика
  const beforeTopicLevelMap = new Map(
    (playerBefore.taskTopics || [])
      .filter(tp => tp.taskTopic)
      .map(tp => [tp.taskTopic!, tp.level])
  );

  // Рендерим диалог через Portal на уровне body
  const dialogContent = (
    <>
      <style>{`
        @keyframes taskCompletionDialogFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .task-completion-dialog-content {
          animation: taskCompletionDialogFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .profile-icon-wrapper svg {
          color: inherit;
          fill: none;
          stroke: currentColor;
        }
      `}</style>
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[100]"
        onClick={handleClose}
        style={{ 
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: '5rem' // Отступ для BottomBar
        }}
      >
        <div
          className="task-completion-dialog-content relative w-full max-w-2xl max-h-[calc(95vh-env(safe-area-inset-top,0px)-5rem)] rounded-2xl md:rounded-3xl overflow-hidden"
          onClick={e => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(5, 8, 18, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(220, 235, 245, 0.2)',
            boxShadow: `
              0 0 30px rgba(180, 220, 240, 0.2),
              inset 0 0 30px rgba(200, 230, 245, 0.03)
            `
          }}
        >
          {/* Holographic grid overlay */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(200, 230, 245, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(200, 230, 245, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          {/* Glowing orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10" style={{
            background: 'rgba(180, 216, 232, 0.8)'
          }}></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-10" style={{
            background: 'rgba(200, 230, 245, 0.6)'
          }}></div>

          {/* Header */}
          <div className="relative z-10 p-4 md:p-6 pb-4">
            <div className="flex items-center justify-between">
              <h2 
                className="text-xl md:text-2xl font-tech font-bold"
                style={{
                  color: '#e8f4f8',
                  textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
                }}
              >
                {t('taskCompletion.title')}
              </h2>
              {/* Close button */}
              <button
                onClick={handleClose}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
                style={{
                  background: 'rgba(220, 235, 245, 0.1)',
                  border: '1px solid rgba(220, 235, 245, 0.2)',
                  color: '#e8f4f8'
                }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 px-4 md:px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
            
            {/* Level Progress - Solo Leveling Style */}
            <div 
              className="relative overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-6 mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(220, 235, 245, 0.2)',
                boxShadow: '0 0 20px rgba(180, 220, 240, 0.15), inset 0 0 20px rgba(200, 230, 245, 0.03)'
              }}
            >
              {/* Glowing orbs */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-xl opacity-10" style={{
                background: 'rgba(234, 179, 8, 0.8)'
              }}></div>
              <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full blur-lg opacity-10" style={{
                background: 'rgba(234, 179, 8, 0.6)'
              }}></div>

              <div className="relative z-10 flex items-center justify-between mb-4">
                <h3 
                  className="text-lg md:text-xl font-tech font-bold flex items-center"
                  style={{
                    color: '#e8f4f8',
                    textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
                  }}
                >
                  <div
                    className="mr-2"
                    style={{
                      color: 'rgba(234, 179, 8, 0.9)',
                      filter: 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.6))'
                    }}
                  >
                    <Icon type="star" size={24} />
                  </div>
                  {t('taskCompletion.level')}
                </h3>
                {/* Level Display */}
                <div className="relative">
                  <div 
                    className="text-2xl md:text-3xl font-tech font-bold rounded-lg px-3 py-1"
                    style={{
                      background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(5, 8, 18, 0.98) 100%)',
                      border: '2px solid rgba(220, 235, 245, 0.4)',
                      color: '#e8f4f8',
                      boxShadow: '0 0 15px rgba(180, 220, 240, 0.3)',
                      textShadow: '0 0 8px rgba(180, 220, 240, 0.4)'
                    }}
                  >
                    {playerAfter.level?.level || 1}
                  </div>
                  {/* Изменение уровня пользователя если повысился */}
                  {(playerAfter.level?.level || 1) > (playerBefore.level?.level || 1) && (
                    <div className="absolute -top-2 -right-2 z-10">
                      <span 
                        className="text-xs font-tech font-bold px-2 py-1 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.7) 100%)',
                          border: '1px solid rgba(34, 197, 94, 0.6)',
                          color: '#e8f4f8',
                          boxShadow: '0 0 10px rgba(34, 197, 94, 0.4)',
                          textShadow: '0 0 4px rgba(34, 197, 94, 0.3)'
                        }}
                      >
                        +{(playerAfter.level?.level || 1) - (playerBefore.level?.level || 1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            
              {/* Experience Progress */}
              <div 
                className="rounded-xl p-3 md:p-4"
                style={{
                  background: 'rgba(220, 235, 245, 0.05)',
                  border: '1px solid rgba(220, 235, 245, 0.1)'
                }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span 
                    className="text-sm md:text-base font-tech font-medium"
                    style={{
                      color: 'rgba(220, 235, 245, 0.8)'
                    }}
                  >
                    {t('taskCompletion.experience')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span 
                      className="text-sm md:text-base font-tech font-bold"
                      style={{
                        color: '#e8f4f8',
                        textShadow: '0 0 4px rgba(180, 220, 240, 0.2)'
                      }}
                    >
                      {playerAfter.level?.currentExperience || 0} / {playerAfter.level?.experienceToNextLevel || 100}
                    </span>
                    {expChange > 0 && (
                      <span 
                        className="text-xs font-tech font-bold rounded-full px-2 py-1"
                        style={{
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.7) 100%)',
                          border: '1px solid rgba(34, 197, 94, 0.6)',
                          color: '#e8f4f8',
                          boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)',
                          textShadow: '0 0 4px rgba(34, 197, 94, 0.3)'
                        }}
                      >
                        +{expChange}
                      </span>
                    )}
                  </div>
                </div>
                
                <div 
                  className="relative w-full rounded-full h-2 md:h-2.5 overflow-hidden"
                  style={{
                    background: 'rgba(220, 235, 245, 0.1)',
                    border: '1px solid rgba(220, 235, 245, 0.2)'
                  }}
                >
                  <div
                    className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${Math.min(100, Math.round(((playerAfter.level?.currentExperience || 0) / (playerAfter.level?.experienceToNextLevel || 100)) * 100))}%`,
                      background: 'linear-gradient(90deg, rgba(180, 220, 240, 0.8) 0%, rgba(160, 210, 235, 0.6) 100%)',
                      boxShadow: '0 0 12px rgba(180, 220, 240, 0.4)'
                    }}
                  >
                    <div 
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 3s ease-in-out infinite',
                        opacity: 0.5
                      }}
                    ></div>
                  </div>
                </div>
              </div>
              
              {/* Topics Progress */}
              {filteredTopicProgress.length > 0 && (
                <div 
                  className="mt-4 pt-4"
                  style={{
                    borderTop: '1px solid rgba(220, 235, 245, 0.1)'
                  }}
                >
                  <h4 
                    className="text-sm md:text-base font-tech font-semibold mb-3 flex items-center"
                    style={{
                      color: '#e8f4f8',
                      textShadow: '0 0 4px rgba(180, 220, 240, 0.2)'
                    }}
                  >
                    <div
                      className="mr-2"
                      style={{
                        color: 'rgba(249, 115, 22, 0.9)',
                        filter: 'drop-shadow(0 0 6px rgba(249, 115, 22, 0.5))'
                      }}
                    >
                      <Icon type="target" size={20} />
                    </div>
                    {t('taskCompletion.topicsProgress')}
                  </h4>
                  <div className="space-y-3">
                    {filteredTopicProgress.map((topicData) => {
                      if (!topicData.taskTopic || !topicData.level) return null;
                      
                      const topic = topicData.taskTopic;
                      const level = topicData.level;
                      const currentExp = level.currentExperience || 0;
                      const maxExp = level.experienceToNextLevel || 100;
                      const progressPercentage = Math.min(100, Math.round((currentExp / maxExp) * 100));
                      
                      return (
                        <div 
                          key={topic} 
                          className="rounded-xl p-3"
                          style={{
                            background: 'rgba(220, 235, 245, 0.05)',
                            border: '1px solid rgba(220, 235, 245, 0.1)'
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <div className="mr-2">
                                <TopicIcon topic={topic} size={16} />
                              </div>
                              <span 
                                className="text-sm font-tech font-medium"
                                style={{
                                  color: 'rgba(220, 235, 245, 0.9)'
                                }}
                              >
                                {t(`topics.labels.${topic}`)}
                              </span>
                            </div>
                            <span 
                              className="text-xs font-tech font-bold px-2 py-1 rounded-full flex items-center whitespace-nowrap"
                              style={{
                                background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.9) 0%, rgba(5, 8, 18, 0.95) 100%)',
                                border: '1px solid rgba(220, 235, 245, 0.3)',
                                color: '#e8f4f8'
                              }}
                            >
                              {t('profile.tabs.level')} {level.level || 1}
                              {/* Изменение уровня топика если повысился */}
                              {(() => {
                                const beforeLvl = beforeTopicLevelMap.get(topic)?.level || 0;
                                const afterLvl = level.level || 0;
                                const delta = afterLvl - beforeLvl;
                                return delta > 0 ? (
                                  <span 
                                    className="ml-2 rounded-full px-1.5 py-0.5"
                                    style={{
                                      background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.7) 100%)',
                                      border: '1px solid rgba(34, 197, 94, 0.6)',
                                      color: '#e8f4f8',
                                      boxShadow: '0 0 8px rgba(34, 197, 94, 0.4)',
                                      textShadow: '0 0 4px rgba(34, 197, 94, 0.3)'
                                    }}
                                  >
                                    +{delta}
                                  </span>
                                ) : null;
                              })()}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div 
                              className="flex justify-between text-xs font-tech"
                              style={{
                                color: 'rgba(220, 235, 245, 0.7)'
                              }}
                            >
                              <span>{t('taskCompletion.experience')}</span>
                              <span className="flex items-center">
                                {currentExp} / {maxExp}
                                {/* Изменение опыта топика пропорционально количеству топиков задачи */}
                                {perTopicExpGain > 0 && (
                                  <span 
                                    className="ml-2 font-bold"
                                    style={{
                                      color: 'rgba(34, 197, 94, 0.9)',
                                      textShadow: '0 0 4px rgba(34, 197, 94, 0.4)'
                                    }}
                                  >
                                    +{perTopicExpGain}
                                  </span>
                                )}
                              </span>
                            </div>
                            <div 
                              className="relative w-full rounded-full h-2 overflow-hidden"
                              style={{
                                background: 'rgba(220, 235, 245, 0.1)',
                                border: '1px solid rgba(220, 235, 245, 0.2)'
                              }}
                            >
                              <div
                                className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                                style={{ 
                                  width: `${progressPercentage}%`,
                                  background: 'linear-gradient(90deg, rgba(180, 220, 240, 0.8) 0%, rgba(160, 210, 235, 0.6) 100%)',
                                  boxShadow: '0 0 10px rgba(180, 220, 240, 0.4)'
                                }}
                              >
                                {progressPercentage > 0 && (
                                  <div 
                                    className="absolute inset-0 rounded-full"
                                    style={{
                                      background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
                                      backgroundSize: '200% 100%',
                                      animation: 'shimmer 3s ease-in-out infinite',
                                      opacity: 0.5
                                    }}
                                  ></div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Stats Changes - Solo Leveling Style */}
            <div 
              className="relative overflow-hidden rounded-2xl md:rounded-3xl p-4 md:p-6 mb-6"
              style={{
                background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(220, 235, 245, 0.2)',
                boxShadow: '0 0 20px rgba(180, 220, 240, 0.15), inset 0 0 20px rgba(200, 230, 245, 0.03)'
              }}
            >
              {/* Glowing orbs */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-xl opacity-10" style={{
                background: 'rgba(180, 216, 232, 0.8)'
              }}></div>
              <div className="absolute -bottom-2 -left-2 w-16 h-16 rounded-full blur-lg opacity-10" style={{
                background: 'rgba(200, 230, 245, 0.6)'
              }}></div>

              <h3 
                className="relative z-10 text-lg md:text-xl font-tech font-bold mb-4 flex items-center justify-center"
                style={{
                  color: '#e8f4f8',
                  textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
                }}
              >
                <div
                  className="mr-3"
                  style={{
                    color: 'rgba(59, 130, 246, 0.9)',
                    filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))'
                  }}
                >
                  <Icon type="trending-up" size={32} />
                </div>
                {t('taskCompletion.stats')}
              </h3>
              <div className="relative z-10 grid grid-cols-3 gap-3">
                {/* Strength */}
                <div 
                  className="relative rounded-xl p-3 text-center transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(220, 38, 38, 0.2)',
                    boxShadow: '0 0 15px rgba(220, 38, 38, 0.1)'
                  }}
                >
                  {/* Badge overlay */}
                  {strengthChange !== 0 && (
                    <div className="absolute -top-1 -right-1 z-10">
                      <span 
                        className="text-xs font-tech font-bold px-2 py-1 rounded-full"
                        style={strengthChange > 0 ? {
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.7) 100%)',
                          border: '1px solid rgba(34, 197, 94, 0.6)',
                          color: '#e8f4f8',
                          boxShadow: '0 0 10px rgba(34, 197, 94, 0.4)',
                          textShadow: '0 0 4px rgba(34, 197, 94, 0.3)'
                        } : {
                          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.7) 100%)',
                          border: '1px solid rgba(220, 38, 38, 0.6)',
                          color: '#e8f4f8',
                          boxShadow: '0 0 10px rgba(220, 38, 38, 0.4)',
                          textShadow: '0 0 4px rgba(220, 38, 38, 0.3)'
                        }}
                      >
                        {strengthChange > 0 ? '+' : ''}{strengthChange}
                      </span>
                    </div>
                  )}
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
                    {playerAfter.strength || 0}
                  </div>
                  <div 
                    className="text-[10px] md:text-xs font-tech"
                    style={{
                      color: 'rgba(220, 235, 245, 0.7)'
                    }}
                  >
                    {t('profile.stats.strength')}
                  </div>
                </div>

                {/* Agility */}
                <div 
                  className="relative rounded-xl p-3 text-center transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(34, 197, 94, 0.2)',
                    boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)'
                  }}
                >
                  {/* Badge overlay */}
                  {agilityChange !== 0 && (
                    <div className="absolute -top-1 -right-1 z-10">
                      <span 
                        className="text-xs font-tech font-bold px-2 py-1 rounded-full"
                        style={agilityChange > 0 ? {
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.7) 100%)',
                          border: '1px solid rgba(34, 197, 94, 0.6)',
                          color: '#e8f4f8',
                          boxShadow: '0 0 10px rgba(34, 197, 94, 0.4)',
                          textShadow: '0 0 4px rgba(34, 197, 94, 0.3)'
                        } : {
                          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.7) 100%)',
                          border: '1px solid rgba(220, 38, 38, 0.6)',
                          color: '#e8f4f8',
                          boxShadow: '0 0 10px rgba(220, 38, 38, 0.4)',
                          textShadow: '0 0 4px rgba(220, 38, 38, 0.3)'
                        }}
                      >
                        {agilityChange > 0 ? '+' : ''}{agilityChange}
                      </span>
                    </div>
                  )}
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
                    {playerAfter.agility || 0}
                  </div>
                  <div 
                    className="text-[10px] md:text-xs font-tech"
                    style={{
                      color: 'rgba(220, 235, 245, 0.7)'
                    }}
                  >
                    {t('profile.stats.agility')}
                  </div>
                </div>

                {/* Intelligence */}
                <div 
                  className="relative rounded-xl p-3 text-center transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(168, 85, 247, 0.2)',
                    boxShadow: '0 0 15px rgba(168, 85, 247, 0.1)'
                  }}
                >
                  {/* Badge overlay */}
                  {intelligenceChange !== 0 && (
                    <div className="absolute -top-1 -right-1 z-10">
                      <span 
                        className="text-xs font-tech font-bold px-2 py-1 rounded-full"
                        style={intelligenceChange > 0 ? {
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.7) 100%)',
                          border: '1px solid rgba(34, 197, 94, 0.6)',
                          color: '#e8f4f8',
                          boxShadow: '0 0 10px rgba(34, 197, 94, 0.4)',
                          textShadow: '0 0 4px rgba(34, 197, 94, 0.3)'
                        } : {
                          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.7) 100%)',
                          border: '1px solid rgba(220, 38, 38, 0.6)',
                          color: '#e8f4f8',
                          boxShadow: '0 0 10px rgba(220, 38, 38, 0.4)',
                          textShadow: '0 0 4px rgba(220, 38, 38, 0.3)'
                        }}
                      >
                        {intelligenceChange > 0 ? '+' : ''}{intelligenceChange}
                      </span>
                    </div>
                  )}
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
                    {playerAfter.intelligence || 0}
                  </div>
                  <div 
                    className="text-[10px] md:text-xs font-tech"
                    style={{
                      color: 'rgba(220, 235, 245, 0.7)'
                    }}
                  >
                    {t('profile.stats.intelligence')}
                  </div>
                </div>
              </div>
            </div>

            {/* Balance Change - Solo Leveling Style */}
            <div 
              className="relative overflow-hidden rounded-2xl md:rounded-3xl mb-6 group"
              style={{
                background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(220, 235, 245, 0.2)',
                boxShadow: '0 0 20px rgba(180, 220, 240, 0.15), inset 0 0 20px rgba(200, 230, 245, 0.03)'
              }}
            >
              {/* Glowing orbs */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-10 animate-float" style={{
                background: 'rgba(234, 179, 8, 0.8)'
              }}></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full blur-xl opacity-10 animate-float-delayed" style={{
                background: 'rgba(234, 179, 8, 0.6)'
              }}></div>
              
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              
              {/* Content */}
              <div className="relative z-10 p-6 text-center">
                {/* Header */}
                <div className="flex justify-center items-center mb-4">
                  <div
                    className="mr-2"
                    style={{
                      color: 'rgba(234, 179, 8, 0.9)',
                      filter: 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.6))'
                    }}
                  >
                    <Icon type="coins" size={28} />
                  </div>
                  <span 
                    className="text-sm font-tech font-medium"
                    style={{
                      color: 'rgba(220, 235, 245, 0.7)',
                      textShadow: '0 0 2px rgba(180, 220, 240, 0.2)'
                    }}
                  >
                    {t('balance.totalBalance')}
                  </span>
                </div>
                
                {/* Balance amount */}
                <div className="mb-4">
                  <div 
                    className="text-3xl md:text-4xl font-tech font-bold mb-2"
                    style={{
                      color: '#e8f4f8',
                      textShadow: '0 0 12px rgba(234, 179, 8, 0.4)'
                    }}
                  >
                    {playerAfter.balance?.balance?.amount || 0}
                  </div>
                  <div 
                    className="text-sm md:text-base font-tech font-semibold"
                    style={{
                      color: 'rgba(234, 179, 8, 0.8)',
                      textShadow: '0 0 6px rgba(234, 179, 8, 0.3)'
                    }}
                  >
                    {playerAfter.balance?.balance?.currencyCode || 'SLCN'}
                  </div>
                </div>
                
                {/* Reward info */}
                <div 
                  className="rounded-xl py-2 px-4 font-tech font-semibold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)',
                    border: '1px solid rgba(34, 197, 94, 0.3)',
                    color: '#e8f4f8',
                    boxShadow: '0 0 10px rgba(34, 197, 94, 0.2)',
                    textShadow: '0 0 4px rgba(34, 197, 94, 0.3)'
                  }}
                >
                  +{balanceChange} {t('taskCompletion.balanceGained')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
    );

  // Рендерим через Portal на уровне body
  return createPortal(dialogContent, document.body);
};

export default TaskCompletionDialog;

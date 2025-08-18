import React, { useEffect } from 'react';
import type { CompleteTaskResponse, Task } from '../api';
import { useLocalization } from '../hooks/useLocalization';


type TaskCompletionDialogProps = {
  response: CompleteTaskResponse;
  completedTask?: Task; // Добавляем задачу, которую выполнил пользователь
  onClose: () => void;
};

const TaskCompletionDialog: React.FC<TaskCompletionDialogProps> = ({ response, completedTask, onClose }) => {
  const { playerBefore, playerAfter } = response;
  const { t } = useLocalization();

  // Блокируем скролл фонового контента при открытии диалога
  useEffect(() => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  const handleClose = () => {
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

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-dialog-backdrop"
      onClick={handleClose}
    >
      <div
        className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[95vh] overflow-hidden animate-dialog-content"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-full blur-3xl -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-400/20 to-purple-400/20 rounded-full blur-2xl translate-y-4 -translate-x-4"></div>

        {/* Header */}
        <div className="relative z-10 p-6 pb-4 animate-dialog-stagger-1">
          <div className="text-center">
            {/* Success icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-4 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              {t('taskCompletion.title')}
            </h2>
            <p className="text-gray-600 text-lg">
              {t('taskCompletion.subtitle')}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 flex items-center justify-center w-8 h-8 rounded-full bg-gray-100/50 backdrop-blur-sm hover:bg-gray-200/50 transition-all duration-200 hover:scale-110 group"
          >
            <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
          
          {/* Level Progress */}
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-blue-200/30 animate-dialog-stagger-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <span className="text-2xl mr-3">⭐</span>
                {t('taskCompletion.level')}
              </h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">
                  {playerAfter.level?.level || 1}
                </div>
                {expChange > 0 && (
                  <div className="text-sm text-green-600 font-medium">
                    +{expChange} XP
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t('taskCompletion.experience')}</span>
                <span className="text-sm font-medium text-gray-800">
                  {playerAfter.level?.currentExperience || 0} / {playerAfter.level?.experienceToNextLevel || 100}
                </span>
              </div>
              
              <div className="relative w-full bg-gray-200/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                  style={{ 
                    width: `${Math.min(100, Math.round(((playerAfter.level?.currentExperience || 0) / (playerAfter.level?.experienceToNextLevel || 100)) * 100))}%` 
                  }}
                >
                  <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                </div>
              </div>
              
              {/* Topics Progress */}
              <div className="mt-4 pt-4 border-t border-blue-200/30">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <span className="text-lg mr-2">🎯</span>
                  {t('taskCompletion.topicsProgress')}
                </h4>
                                  <div className="space-y-3">
                    {topicProgress.map((topicData) => {
                      if (!topicData.taskTopic || !topicData.level) return null;
                      
                      const topic = topicData.taskTopic;
                      const level = topicData.level;
                      const currentExp = level.currentExperience || 0;
                      const maxExp = level.experienceToNextLevel || 100;
                      const progressPercentage = Math.min(100, Math.round((currentExp / maxExp) * 100));
                      
                      return (
                        <div key={topic} className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              {t(`topics.labels.${topic}`)}
                            </span>
                                                          <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-full">
                                {t('profile.tabs.level')} {level.level || 1}
                              </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{t('taskCompletion.experience')}</span>
                              <span>{currentExp} / {maxExp}</span>
                            </div>
                            <div className="relative w-full bg-gray-200/50 rounded-full h-2 overflow-hidden">
                              <div
                                className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                              >
                                <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
              </div>
            </div>
          </div>

          {/* Stats Changes */}
          <div className="bg-gradient-to-br from-gray-50/80 to-slate-50/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-200/30 animate-dialog-stagger-3">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <span className="text-2xl mr-3">⚔️</span>
              {t('taskCompletion.stats')}
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Strength */}
              <div className="flex-1 text-center">
                <div className="text-2xl mb-2">💪</div>
                <div className="text-xl font-bold text-red-600 mb-1">
                  {playerAfter.strength || 0}
                </div>
                <div className="text-xs text-red-500 font-medium mb-2">{t('profile.stats.strength')}</div>
                {strengthChange !== 0 && (
                  <div className={`text-sm font-bold px-2 py-1 rounded-full ${
                    strengthChange > 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {strengthChange > 0 ? '+' : ''}{strengthChange}
                  </div>
                )}
              </div>

              {/* Agility */}
              <div className="flex-1 text-center">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-xl font-bold text-green-600 mb-1">
                  {playerAfter.agility || 0}
                </div>
                <div className="text-xs text-green-500 font-medium mb-2">{t('profile.stats.agility')}</div>
                {agilityChange !== 0 && (
                  <div className={`text-sm font-bold px-2 py-1 rounded-full ${
                    agilityChange > 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {agilityChange > 0 ? '+' : ''}{agilityChange}
                  </div>
                )}
              </div>

              {/* Intelligence */}
              <div className="flex-1 text-center">
                <div className="text-2xl mb-2">🧠</div>
                <div className="text-xl font-bold text-purple-600 mb-1">
                  {playerAfter.intelligence || 0}
                </div>
                <div className="text-xs text-purple-500 font-medium mb-2">{t('profile.stats.intelligence')}</div>
                {intelligenceChange !== 0 && (
                  <div className={`text-sm font-bold px-2 py-1 rounded-full ${
                    intelligenceChange > 0 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {intelligenceChange > 0 ? '+' : ''}{intelligenceChange}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Balance Change */}
          <div className="bg-gradient-to-r from-amber-50/80 to-orange-50/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-amber-200/30 text-center animate-dialog-stagger-4">
            <div className="text-2xl mb-3">💰</div>
            <div className="text-3xl font-bold text-amber-700 mb-2">
              {playerAfter.balance?.balance?.amount || 0} {playerAfter.balance?.balance?.currencyCode || 'GCO'}
            </div>
                          <div className="text-sm text-amber-600 font-medium">
                +{balanceChange} {t('taskCompletion.balanceGained')}
              </div>
          </div>



          {/* Continue Button */}
          <div className="text-center mt-8 animate-dialog-stagger-4">
            <button
              onClick={handleClose}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group"
            >
              <span className="mr-2">{t('taskCompletion.continue')}</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCompletionDialog;

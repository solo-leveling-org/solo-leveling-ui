import React, { useEffect } from 'react';
import type { CompleteTaskResponse, Task } from '../api';
import { useLocalization } from '../hooks/useLocalization';
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
          
          {/* Level Progress - Compact Design */}
          <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-blue-200/30 animate-dialog-stagger-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-gray-800 flex items-center">
                <Icon type="star" size={24} className="mr-2 text-yellow-500" />
                {t('taskCompletion.level')}
              </h3>
              {/* Level Display - Compact */}
              <div className="flex items-center">
                <div className="text-2xl font-bold text-blue-600 bg-white/60 backdrop-blur-sm rounded-lg px-3 py-1 border border-blue-200/30 shadow-sm">
                  {playerAfter.level?.level || 1}
                </div>
                {/* Изменение уровня пользователя если повысился */}
                {(playerAfter.level?.level || 1) > (playerBefore.level?.level || 1) && (
                  <div className="ml-2 bg-green-50 text-green-600 border border-green-200 text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                    +{(playerAfter.level?.level || 1) - (playerBefore.level?.level || 1)}
                  </div>
                )}
              </div>
            </div>
            
            {/* Experience Progress - Integrated XP */}
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">{t('taskCompletion.experience')}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-800">
                    {playerAfter.level?.currentExperience || 0} / {playerAfter.level?.experienceToNextLevel || 100}
                  </span>
                  {expChange > 0 && (
                    <span className="text-xs text-green-600 font-bold bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
                      +{expChange}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="relative w-full bg-gray-200/50 rounded-full h-2 overflow-hidden backdrop-blur-sm">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-sm"
                  style={{ 
                    width: `${Math.min(100, Math.round(((playerAfter.level?.currentExperience || 0) / (playerAfter.level?.experienceToNextLevel || 100)) * 100))}%` 
                  }}
                >
                  <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
              
            {/* Topics Progress */}
            {filteredTopicProgress.length > 0 && (
                <div className="mt-4 pt-4 border-t border-blue-200/30">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Icon type="target" size={20} className="mr-2 text-orange-500" />
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
                        <div key={topic} className="bg-white/40 backdrop-blur-sm rounded-xl p-3 border border-white/20">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                              <TopicIcon topic={topic} size={16} className="mr-2" />
                              <span className="text-sm font-medium text-gray-700">
                                {t(`topics.labels.${topic}`)}
                              </span>
                            </div>
                            <span className="text-xs text-blue-600 font-bold bg-blue-50 px-2 py-1 rounded-full flex items-center whitespace-nowrap">
                              {t('profile.tabs.level')} {level.level || 1}
                              {/* Изменение уровня топика если повысился */}
                              {(() => {
                                const beforeLvl = beforeTopicLevelMap.get(topic)?.level || 0;
                                const afterLvl = level.level || 0;
                                const delta = afterLvl - beforeLvl;
                                return delta > 0 ? (
                                  <span className="ml-2 text-green-600 bg-green-50 border border-green-200 rounded-full px-1.5 py-0.5">+{delta}</span>
                                ) : null;
                              })()}
                            </span>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500">
                              <span>{t('taskCompletion.experience')}</span>
                              <span className="flex items-center">
                                {currentExp} / {maxExp}
                                {/* Изменение опыта топика пропорционально количеству топиков задачи */}
                                {perTopicExpGain > 0 && (
                                  <span className="ml-2 text-green-600 font-bold">+{perTopicExpGain}</span>
                                )}
                              </span>
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
              )}
          </div>

          {/* Stats Changes */}
          <div className="bg-gradient-to-br from-gray-50/80 to-slate-50/80 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-200/30 animate-dialog-stagger-3">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center justify-center">
              <Icon type="trending-up" size={32} className="mr-3 text-blue-600" />
              {t('taskCompletion.stats')}
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {/* Strength */}
              <div className="relative bg-gradient-to-br from-red-50/80 to-red-100/80 backdrop-blur-sm rounded-xl p-3 text-center border border-red-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Badge overlay */}
                {strengthChange !== 0 && (
                  <div className="absolute -top-1 -right-1 z-10">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full shadow-lg ${
                      strengthChange > 0
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {strengthChange > 0 ? '+' : ''}{strengthChange}
                    </span>
                  </div>
                )}
                <div className="flex justify-center items-center mb-1">
                  <Icon type="dumbbell" size={24} className="text-red-500" />
                </div>
                <div className="text-lg font-bold text-red-600 mb-1">
                  {playerAfter.strength || 0}
                </div>
                <div className="text-xs text-red-500 font-medium">{t('profile.stats.strength')}</div>
              </div>

              {/* Agility */}
              <div className="relative bg-gradient-to-br from-green-50/80 to-green-100/80 backdrop-blur-sm rounded-xl p-3 text-center border border-green-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Badge overlay */}
                {agilityChange !== 0 && (
                  <div className="absolute -top-1 -right-1 z-10">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full shadow-lg ${
                      agilityChange > 0
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {agilityChange > 0 ? '+' : ''}{agilityChange}
                    </span>
                  </div>
                )}
                <div className="flex justify-center items-center mb-1">
                  <Icon type="zap" size={24} className="text-green-500" />
                </div>
                <div className="text-lg font-bold text-green-600 mb-1">
                  {playerAfter.agility || 0}
                </div>
                <div className="text-xs text-green-500 font-medium">{t('profile.stats.agility')}</div>
              </div>

              {/* Intelligence */}
              <div className="relative bg-gradient-to-br from-purple-50/80 to-purple-100/80 backdrop-blur-sm rounded-xl p-3 text-center border border-purple-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {/* Badge overlay */}
                {intelligenceChange !== 0 && (
                  <div className="absolute -top-1 -right-1 z-10">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full shadow-lg ${
                      intelligenceChange > 0
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {intelligenceChange > 0 ? '+' : ''}{intelligenceChange}
                    </span>
                  </div>
                )}
                <div className="flex justify-center items-center mb-1">
                  <Icon type="brain" size={24} className="text-purple-500" />
                </div>
                <div className="text-lg font-bold text-purple-600 mb-1">
                  {playerAfter.intelligence || 0}
                </div>
                <div className="text-xs text-purple-500 font-medium">{t('profile.stats.intelligence')}</div>
              </div>
            </div>
          </div>

          {/* Balance Change - Mobile Banking Style */}
          <div className="relative overflow-hidden rounded-2xl mb-6 animate-dialog-stagger-4">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-white/10 rounded-2xl"></div>
            
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -translate-y-12 translate-x-12"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8"></div>
            
            {/* Content */}
            <div className="relative p-6 text-white text-center">
              {/* Header */}
              <div className="flex justify-center items-center mb-4">
                <Icon type="coins" size={24} className="text-yellow-300 mr-2" />
                <span className="text-blue-100 text-sm font-medium">{t('balance.totalBalance')}</span>
              </div>
              
              {/* Balance amount */}
              <div className="mb-3">
                <div className="text-2xl font-bold text-white mb-1">
                  {playerAfter.balance?.balance?.amount || 0}
                </div>
                <div className="text-blue-200 text-sm font-medium">
                  {playerAfter.balance?.balance?.currencyCode || 'SLCN'}
                </div>
              </div>
              
              {/* Reward info */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl py-2 px-4 text-white text-sm font-medium">
                +{balanceChange} {t('taskCompletion.balanceGained')}
              </div>
            </div>
          </div>



        </div>
      </div>
    </div>
  );
};

export default TaskCompletionDialog;

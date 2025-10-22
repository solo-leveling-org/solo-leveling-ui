import React, {useEffect} from 'react';
import type {Task} from '../api';
import TopicIcon from './TopicIcons';
import Icon from './Icon';
import RarityIndicator from './RarityIndicator';
import { useLocalization } from '../hooks/useLocalization';

type TaskDialogProps = {
  task: Task;
  onClose: () => void;
};

const TaskDialog: React.FC<TaskDialogProps> = ({task, onClose}) => {
  const { t } = useLocalization();
  
  // Блокируем скролл фонового контента при открытии диалога
  useEffect(() => {
    // Сохраняем текущую позицию скролла
    const scrollY = window.scrollY;

    // Блокируем скролл
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = '100%';

    // Cleanup при размонтировании
    return () => {
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, scrollY);
    };
  }, []);

  // Обработчик закрытия с восстановлением скролла
  const handleClose = () => {
    onClose();
  };




  return (
      <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[100] animate-dialog-backdrop"
          onClick={handleClose}
          style={{ 
            paddingTop: 'env(safe-area-inset-top, 0px)',
            paddingBottom: '5rem' // Отступ для BottomBar
          }}
      >
        <div
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md max-h-[calc(95vh-env(safe-area-inset-top,0px)-5rem)] mobile-version:max-h-[calc(85vh-env(safe-area-inset-top,0px)-5rem)] overflow-hidden animate-dialog-content"
            onClick={e => e.stopPropagation()}
        >
          {/* Decorative background elements */}
          <div
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl -translate-y-8 translate-x-8"></div>
          <div
              className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-2xl translate-y-4 -translate-x-4"></div>

          {/* Header */}
          <div className="relative z-10 p-6 pb-4 animate-dialog-stagger-1">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 pr-4">
                <h2 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                  {task.title}
                </h2>
              </div>

              {/* Close button */}
              <button
                  onClick={handleClose}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100/50 backdrop-blur-sm hover:bg-gray-200/50 transition-all duration-200 hover:scale-110 group"
              >
                <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors"
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>

            {/* Rarity indicator - inline with title */}
            <div className="flex items-center justify-center mb-4">
              <RarityIndicator 
                rarity={task.rarity || 'COMMON'} 
                size="md"
                showLabel={true}
              />
            </div>
          </div>

          {/* Scrollable content */}
          <div className="relative z-10 px-6 pb-6 overflow-y-auto max-h-[calc(90vh-200px)] mobile-version:max-h-[calc(75vh-200px)]">
            {/* Description */}
            <div
                className="bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-200/30 animate-dialog-stagger-2">
              <p className="text-gray-700 leading-relaxed text-sm">
                {task.description}
              </p>
            </div>

            {/* Rewards section */}
            <div className="mb-6 animate-dialog-stagger-3">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                <Icon type="sparkles" size={16} className="mr-2 text-yellow-500" />
                {t('dialogs.task.rewardsTitle')}
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div
                    className="bg-gradient-to-br from-yellow-50/80 to-orange-50/80 backdrop-blur-sm rounded-xl p-3 border border-yellow-200/30 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex justify-center items-center mb-2">
                    <Icon type="star" size={24} className="text-orange-500" />
                  </div>
                  <div className="text-lg font-bold text-orange-600">{task.experience || 0}</div>
                  <div className="text-xs text-orange-500 font-medium">{t('dialogs.task.experience')}</div>
                </div>
                <div
                    className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-xl p-3 border border-green-200/30 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex justify-center items-center mb-2">
                    <Icon type="coins" size={24} className="text-green-500" />
                  </div>
                  <div className="text-lg font-bold text-green-600">{task.currencyReward || 0}</div>
                  <div className="text-xs text-green-500 font-medium">{t('dialogs.task.coins')}</div>
                </div>
              </div>
            </div>

            {/* Stats section */}
            <div className="mb-6 animate-dialog-stagger-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                <Icon type="clock" size={16} className="mr-2 text-blue-500" />
                {t('dialogs.task.statsTitle')}
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div
                    className="bg-gradient-to-br from-red-50/80 to-red-100/80 backdrop-blur-sm rounded-xl p-3 text-center border border-red-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex justify-center items-center mb-1">
                    <Icon type="dumbbell" size={32} className="text-red-500" />
                  </div>
                  <div className="text-lg font-bold text-red-600">{task.strength || 0}</div>
                  <div className="text-xs text-red-500 font-medium">{t('profile.stats.strength')}</div>
                </div>

                <div
                    className="bg-gradient-to-br from-green-50/80 to-green-100/80 backdrop-blur-sm rounded-xl p-3 text-center border border-green-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex justify-center items-center mb-1">
                    <Icon type="zap" size={32} className="text-green-500" />
                  </div>
                  <div className="text-lg font-bold text-green-600">{task.agility || 0}</div>
                  <div className="text-xs text-green-500 font-medium">{t('profile.stats.agility')}</div>
                </div>

                <div
                    className="bg-gradient-to-br from-purple-50/80 to-purple-100/80 backdrop-blur-sm rounded-xl p-3 text-center border border-purple-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex justify-center items-center mb-1">
                    <Icon type="brain" size={32} className="text-purple-500" />
                  </div>
                  <div className="text-lg font-bold text-purple-600">{task.intelligence || 0}</div>
                  <div className="text-xs text-purple-500 font-medium">{t('profile.stats.intelligence')}</div>
                </div>
              </div>
            </div>

            {/* Topics section */}
            {task.topics && task.topics.length > 0 && (
                <div className="mb-4 animate-dialog-stagger-4" style={{animationDelay: '0.5s'}}>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    {t('dialogs.task.categoriesTitle')}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {task.topics.map((topic, index) => (
                        <div
                            key={topic}
                            className="inline-flex items-center bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm text-blue-700 px-3 py-2 rounded-full text-xs font-medium border border-blue-200/30 hover:shadow-md transition-all duration-200 hover:scale-105 animate-dialog-stagger-4"
                            style={{animationDelay: `${0.6 + index * 0.1}s`}}
                        >
                          <TopicIcon topic={topic} size={16} className="mr-1" />
                          {t(`topics.labels.${topic}`)}
                        </div>
                    ))}
                  </div>
                </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default TaskDialog;
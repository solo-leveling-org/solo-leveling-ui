import React, {useEffect} from 'react';
import type {Task} from '../api';
import {topicIcons} from '../topicMeta';
import { ReactComponent as CoinsIcon } from '../assets/icons/coins.svg';
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
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-dialog-backdrop"
          onClick={handleClose}
      >
        <div
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md max-h-[90vh] overflow-hidden animate-dialog-content"
            onClick={e => e.stopPropagation()}
        >
          {/* Decorative background elements */}
          <div
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -translate-y-8 translate-x-8"></div>
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
          <div className="relative z-10 px-6 pb-6 max-h-[calc(90vh-120px)] overflow-y-auto">
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
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732L14.146 12.8l-1.179 4.456a1 1 0 01-1.934 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732L9.854 7.2l1.179-4.456A1 1 0 0112 2z" clipRule="evenodd" />
                </svg>
                Награды
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div
                    className="bg-gradient-to-br from-yellow-50/80 to-orange-50/80 backdrop-blur-sm rounded-xl p-3 border border-yellow-200/30 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <svg className="w-6 h-6 mx-auto mb-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <div className="text-lg font-bold text-orange-600">{task.experience || 0}</div>
                  <div className="text-xs text-orange-500 font-medium">Опыт</div>
                </div>
                <div
                    className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-xl p-3 border border-green-200/30 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CoinsIcon className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-lg font-bold text-green-600">{task.currencyReward || 0}</div>
                  <div className="text-xs text-green-500 font-medium">Монеты</div>
                </div>
              </div>
            </div>

            {/* Stats section */}
            <div className="mb-6 animate-dialog-stagger-4">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
                  <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
                </svg>
                Характеристики
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div
                    className="bg-gradient-to-br from-red-50/80 to-red-100/80 backdrop-blur-sm rounded-xl p-3 text-center border border-red-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-2xl mb-1">💪</div>
                  <div className="text-lg font-bold text-red-600">{task.strength || 0}</div>
                  <div className="text-xs text-red-500 font-medium">Сила</div>
                </div>

                <div
                    className="bg-gradient-to-br from-green-50/80 to-green-100/80 backdrop-blur-sm rounded-xl p-3 text-center border border-green-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-2xl mb-1">⚡</div>
                  <div className="text-lg font-bold text-green-600">{task.agility || 0}</div>
                  <div className="text-xs text-green-500 font-medium">Ловкость</div>
                </div>

                <div
                    className="bg-gradient-to-br from-purple-50/80 to-purple-100/80 backdrop-blur-sm rounded-xl p-3 text-center border border-purple-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-2xl mb-1">🧠</div>
                  <div className="text-lg font-bold text-purple-600">{task.intelligence || 0}</div>
                  <div className="text-xs text-purple-500 font-medium">Интеллект</div>
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
                    Категории
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {task.topics.map((topic, index) => (
                        <div
                            key={topic}
                            className="inline-flex items-center bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm text-blue-700 px-3 py-2 rounded-full text-xs font-medium border border-blue-200/30 hover:shadow-md transition-all duration-200 hover:scale-105 animate-dialog-stagger-4"
                            style={{animationDelay: `${0.6 + index * 0.1}s`}}
                        >
                          <span className="mr-1">{topicIcons[topic] || '❓'}</span>
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
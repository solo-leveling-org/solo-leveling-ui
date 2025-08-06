import React, {useEffect} from 'react';
import type {Task} from '../api';
import {topicIcons, topicLabels} from '../topicMeta';

type TaskDialogProps = {
  task: Task;
  onClose: () => void;
};

const TaskDialog: React.FC<TaskDialogProps> = ({task, onClose}) => {
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
  // Определяем цвета и стили для редкости
  const getRarityConfig = (rarity: string) => {
    const configs = {
      COMMON: {
        bg: 'from-gray-400 to-gray-600',
        border: 'border-gray-300',
        glow: 'shadow-gray-400/25',
        text: 'text-gray-700'
      },
      UNCOMMON: {
        bg: 'from-green-400 to-green-600',
        border: 'border-green-300',
        glow: 'shadow-green-400/25',
        text: 'text-green-700'
      },
      RARE: {
        bg: 'from-blue-400 to-blue-600',
        border: 'border-blue-300',
        glow: 'shadow-blue-400/25',
        text: 'text-blue-700'
      },
      EPIC: {
        bg: 'from-purple-400 to-purple-600',
        border: 'border-purple-300',
        glow: 'shadow-purple-400/25',
        text: 'text-purple-700'
      },
      LEGENDARY: {
        bg: 'from-yellow-400 via-orange-500 to-red-500',
        border: 'border-orange-300',
        glow: 'shadow-orange-400/25',
        text: 'text-orange-700'
      }
    };
    return configs[rarity as keyof typeof configs] || configs.COMMON;
  };

  const rarityConfig = getRarityConfig(task.rarity || 'COMMON');

  return (
      <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-300"
          onClick={handleClose}
      >
        <div
            className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
        >
          {/* Decorative background elements */}
          <div
              className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl -translate-y-8 translate-x-8"></div>
          <div
              className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-2xl translate-y-4 -translate-x-4"></div>

          {/* Header */}
          <div className="relative z-10 p-6 pb-4">
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

            {/* Rarity badge */}
            <div className="flex justify-center mb-4">
              <div
                  className={`inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${rarityConfig.bg} text-white text-sm font-bold shadow-lg ${rarityConfig.glow} border-2 ${rarityConfig.border}`}>
                {task.rarity || 'COMMON'}
              </div>
            </div>
          </div>

          {/* Scrollable content */}
          <div className="relative z-10 px-6 pb-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {/* Description */}
            <div
                className="bg-gradient-to-br from-gray-50/80 to-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-gray-200/30">
              <p className="text-gray-700 leading-relaxed text-sm">
                {task.description}
              </p>
            </div>

            {/* Rewards section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                <span className="mr-2">🎁</span>
                Награды
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div
                    className="bg-gradient-to-br from-yellow-50/80 to-orange-50/80 backdrop-blur-sm rounded-xl p-3 border border-yellow-200/30 text-center">
                  <div className="text-2xl mb-1">⭐</div>
                  <div className="text-lg font-bold text-orange-600">{task.experience || 0}</div>
                  <div className="text-xs text-orange-500 font-medium">Опыт</div>
                </div>
                <div
                    className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-xl p-3 border border-green-200/30 text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="text-lg font-bold text-green-600">{task.currencyReward || 0}</div>
                  <div className="text-xs text-green-500 font-medium">Монеты</div>
                </div>
              </div>
            </div>

            {/* Stats section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                <span className="mr-2">📊</span>
                Характеристики
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div
                    className="bg-gradient-to-br from-red-50/80 to-red-100/80 backdrop-blur-sm rounded-xl p-3 text-center border border-red-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-xl mb-1">💪</div>
                  <div className="text-lg font-bold text-red-600">{task.strength || 0}</div>
                  <div className="text-xs text-red-500 font-medium">Сила</div>
                </div>

                <div
                    className="bg-gradient-to-br from-green-50/80 to-green-100/80 backdrop-blur-sm rounded-xl p-3 text-center border border-green-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-xl mb-1">⚡</div>
                  <div className="text-lg font-bold text-green-600">{task.agility || 0}</div>
                  <div className="text-xs text-green-500 font-medium">Ловкость</div>
                </div>

                <div
                    className="bg-gradient-to-br from-purple-50/80 to-purple-100/80 backdrop-blur-sm rounded-xl p-3 text-center border border-purple-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="text-xl mb-1">🧠</div>
                  <div className="text-lg font-bold text-purple-600">{task.intelligence || 0}</div>
                  <div className="text-xs text-purple-500 font-medium">Интеллект</div>
                </div>
              </div>
            </div>

            {/* Topics section */}
            {task.topics && task.topics.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center">
                    <span className="mr-2">🏷️</span>
                    Категории
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {task.topics.map((topic) => (
                        <div
                            key={topic}
                            className="inline-flex items-center bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm text-blue-700 px-3 py-2 rounded-full text-xs font-medium border border-blue-200/30 hover:shadow-md transition-all duration-200 hover:scale-105"
                        >
                          <span className="mr-1">{topicIcons[topic] || '❓'}</span>
                          {topicLabels[topic] || topic}
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
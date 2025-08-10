import React, { useState, useEffect } from 'react';
import { TaskTopic } from '../api';
import type { GetPlayerTopicsResponse } from '../api';
import { api } from '../services';
import { useNavigate } from 'react-router-dom';
import { topicIcons, topicLabels } from '../topicMeta';

type TopicsTabProps = {
  isAuthenticated: boolean;
};

const TopicsTab: React.FC<TopicsTabProps> = ({ isAuthenticated }) => {
  const [allTopics] = useState<TaskTopic[]>(Object.values(TaskTopic));
  const [selectedTopics, setSelectedTopics] = useState<TaskTopic[]>([]);
  const [originalTopics, setOriginalTopics] = useState<TaskTopic[]>([]);
  const [firstTime, setFirstTime] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // Загружаем выбранные темы только при монтировании компонента и если авторизованы
  useEffect(() => {
    if (isAuthenticated) {
      api.getUserTopics()
        .then((res: GetPlayerTopicsResponse) => {
          const topics = res.playerTaskTopics
          .map((pt) => pt.taskTopic!)
          .filter(Boolean);
          setSelectedTopics(topics);
          setOriginalTopics(topics); // Сохраняем исходные темы для сравнения
          setFirstTime(res.playerTaskTopics.length === 0);
        })
        .catch((error: any) => {
          console.error('Error getting player topics:', error);
        });
    }
  }, [isAuthenticated]);

  // Проверяем, изменились ли топики
  const hasChanges = () => {
    if (selectedTopics.length !== originalTopics.length) return true;
    return !selectedTopics.every((topic) => originalTopics.includes(topic));
  };

  const canSave = selectedTopics.length > 0 && (firstTime || hasChanges());

  const handleToggle = (topic: TaskTopic) => {
    setSelectedTopics((prev) =>
        prev.includes(topic)
            ? prev.filter((t) => t !== topic)
            : [...prev, topic]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    await api.saveUserTopics(selectedTopics);
    setOriginalTopics(selectedTopics); // Обновляем исходные темы после сохранения
    if (firstTime) {
      await api.generateTasks();
    }
    setSaving(false);
    if (firstTime) navigate('/tasks');
  };

  // Определяем цветовые схемы для разных топиков
  const getTopicColorScheme = (topic: TaskTopic) => {
    const colorSchemes = {
      PHYSICAL_ACTIVITY: {
        bg: 'from-red-50/80 to-orange-50/80',
        border: 'border-red-200/40',
        selectedBg: 'from-red-100/90 to-orange-100/90',
        selectedBorder: 'border-red-300/60',
        text: 'text-red-700',
        selectedText: 'text-red-800',
        checkBg: 'bg-red-500',
        glow: 'shadow-red-200/50',
      },
      MENTAL_HEALTH: {
        bg: 'from-purple-50/80 to-pink-50/80',
        border: 'border-purple-200/40',
        selectedBg: 'from-purple-100/90 to-pink-100/90',
        selectedBorder: 'border-purple-300/60',
        text: 'text-purple-700',
        selectedText: 'text-purple-800',
        checkBg: 'bg-purple-500',
        glow: 'shadow-purple-200/50',
      },
      EDUCATION: {
        bg: 'from-blue-50/80 to-indigo-50/80',
        border: 'border-blue-200/40',
        selectedBg: 'from-blue-100/90 to-indigo-100/90',
        selectedBorder: 'border-blue-300/60',
        text: 'text-blue-700',
        selectedText: 'text-blue-800',
        checkBg: 'bg-blue-500',
        glow: 'shadow-blue-200/50',
      },
      CREATIVITY: {
        bg: 'from-pink-50/80 to-rose-50/80',
        border: 'border-pink-200/40',
        selectedBg: 'from-pink-100/90 to-rose-100/90',
        selectedBorder: 'border-pink-300/60',
        text: 'text-pink-700',
        selectedText: 'text-pink-800',
        checkBg: 'bg-pink-500',
        glow: 'shadow-pink-200/50',
      },
      SOCIAL_SKILLS: {
        bg: 'from-yellow-50/80 to-amber-50/80',
        border: 'border-yellow-200/40',
        selectedBg: 'from-yellow-100/90 to-amber-100/90',
        selectedBorder: 'border-yellow-300/60',
        text: 'text-yellow-700',
        selectedText: 'text-yellow-800',
        checkBg: 'bg-yellow-500',
        glow: 'shadow-yellow-200/50',
      },
      HEALTHY_EATING: {
        bg: 'from-green-50/80 to-emerald-50/80',
        border: 'border-green-200/40',
        selectedBg: 'from-green-100/90 to-emerald-100/90',
        selectedBorder: 'border-green-300/60',
        text: 'text-green-700',
        selectedText: 'text-green-800',
        checkBg: 'bg-green-500',
        glow: 'shadow-green-200/50',
      },
      PRODUCTIVITY: {
        bg: 'from-orange-50/80 to-red-50/80',
        border: 'border-orange-200/40',
        selectedBg: 'from-orange-100/90 to-red-100/90',
        selectedBorder: 'border-orange-300/60',
        text: 'text-orange-700',
        selectedText: 'text-orange-800',
        checkBg: 'bg-orange-500',
        glow: 'shadow-orange-200/50',
      },
      EXPERIMENTS: {
        bg: 'from-cyan-50/80 to-teal-50/80',
        border: 'border-cyan-200/40',
        selectedBg: 'from-cyan-100/90 to-teal-100/90',
        selectedBorder: 'border-cyan-300/60',
        text: 'text-cyan-700',
        selectedText: 'text-cyan-800',
        checkBg: 'bg-cyan-500',
        glow: 'shadow-cyan-200/50',
      },
      ECOLOGY: {
        bg: 'from-lime-50/80 to-green-50/80',
        border: 'border-lime-200/40',
        selectedBg: 'from-lime-100/90 to-green-100/90',
        selectedBorder: 'border-lime-300/60',
        text: 'text-lime-700',
        selectedText: 'text-lime-800',
        checkBg: 'bg-lime-500',
        glow: 'shadow-lime-200/50',
      },
      TEAMWORK: {
        bg: 'from-indigo-50/80 to-blue-50/80',
        border: 'border-indigo-200/40',
        selectedBg: 'from-indigo-100/90 to-blue-100/90',
        selectedBorder: 'border-indigo-300/60',
        text: 'text-indigo-700',
        selectedText: 'text-indigo-800',
        checkBg: 'bg-indigo-500',
        glow: 'shadow-indigo-200/50',
      },
    };
    return colorSchemes[topic];
  };

  return (
      <div className="relative min-h-screen">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/10 to-orange-400/10 rounded-full blur-2xl"></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 tracking-tight">
              Выбор топиков
            </h1>

            <p className="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
              Выберите интересующие вас области для получения персональных заданий
            </p>

            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto"></div>
          </div>

          {/* Topics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
            {allTopics.map((topic, index) => {
              const isSelected = selectedTopics.includes(topic);
              const colorScheme = getTopicColorScheme(topic);
              return (
                  <button
                      key={topic}
                      type="button"
                      onClick={() => handleToggle(topic)}
                      className={`group relative p-4 sm:p-6 rounded-3xl backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 ${
                          isSelected
                              ? `bg-gradient-to-br ${colorScheme.selectedBg} border-2 ${colorScheme.selectedBorder} shadow-lg ${colorScheme.glow}`
                              : `bg-gradient-to-br ${colorScheme.bg} border border-white/30 hover:border-white/50 hover:shadow-md`
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                      }}
                  >
                    {/* Selection indicator */}
                    {isSelected && (
                        <>
                          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-white">
                            <div
                                className={`w-5 h-5 ${colorScheme.checkBg} rounded-full flex items-center justify-center`}
                            >
                              <svg
                                  className="w-3 h-3 text-white"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                              >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
                        </>
                    )}

                    {/* Content */}
                    <div className="relative z-10 text-center">
                      {/* Icon */}
                      <div
                          className={`text-3xl sm:text-4xl mb-3 sm:mb-4 transition-transform duration-200 ${
                              isSelected ? 'scale-110' : 'group-hover:scale-110'
                          }`}
                      >
                        {topicIcons[topic] || '❓'}
                      </div>

                      {/* Label */}
                      <div
                          className={`text-xs sm:text-sm font-semibold leading-tight transition-colors duration-200 ${
                              isSelected
                                  ? colorScheme.selectedText
                                  : `${colorScheme.text} group-hover:text-gray-800`
                          }`}
                      >
                        {topicLabels[topic] || topic}
                      </div>
                    </div>

                    {/* Hover glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                  </button>
              );
            })}
          </div>

          {/* Info section */}
          <div className="relative overflow-hidden bg-gradient-to-br from-blue-50/90 to-indigo-50/90 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-blue-200/30 shadow-lg">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-full blur-2xl -translate-y-4 translate-x-4"></div>

            <div className="relative z-10">
              <div className="flex items-start mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0 shadow-lg">
                  <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-blue-800 mb-2 text-lg">
                    {firstTime ? 'Добро пожаловать!' : 'Настройка предпочтений'}
                  </h3>
                  <p className="text-blue-700/80 text-sm leading-relaxed">
                    {firstTime
                        ? 'Выберите интересующие вас области для получения персональных заданий. После сохранения система создаст задачи специально для вас!'
                        : 'Измените свои предпочтения в любое время. Система адаптирует задания под ваши интересы.'
                    }
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z"/>
                        <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-gray-800">
                        {selectedTopics.length} / {allTopics.length}
                      </div>
                      <div className="text-xs text-gray-600">Выбрано топиков</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-4 border border-white/30">
                  <div className="flex items-center">
                    <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            canSave ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gray-400'
                        }`}
                    >
                      {canSave ? (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      )}
                    </div>
                    <div>
                      <div
                          className={`text-lg font-bold ${
                              canSave ? 'text-green-700' : 'text-gray-600'
                          }`}
                      >
                        {firstTime
                            ? 'Новый профиль'
                            : hasChanges()
                                ? 'Есть изменения'
                                : 'Без изменений'}
                      </div>
                      <div className="text-xs text-gray-600">Статус</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="text-center">
            <button
                onClick={handleSave}
                disabled={saving || !canSave}
                className={`inline-flex items-center px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300 ${
                    saving || !canSave
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 hover:shadow-xl hover:scale-105 active:scale-95 shadow-lg'
                }`}
            >
              {saving ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white/20 border-t-white rounded-full mr-3"></div>
                    Сохраняю...
                  </>
              ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                    </svg>
                    Сохранить
                  </>
              )}
            </button>

            {!canSave && !saving && (
                <p className="text-gray-500 text-sm mt-3">
                  {selectedTopics.length === 0
                      ? 'Выберите хотя бы один топик для продолжения'
                      : 'Нет изменений для сохранения'}
                </p>
            )}
          </div>
        </div>
      </div>
  );
};

export default TopicsTab;
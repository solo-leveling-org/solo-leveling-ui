import React, { useState, useEffect } from 'react';
import { TaskTopic, Assessment } from '../api';
import type { GetPlayerTopicsResponse, PlayerTaskTopic } from '../api';
import { api } from '../services';
import { useNavigate } from 'react-router-dom';
import TopicIcon from '../components/TopicIcons';
import { useLocalization } from '../hooks/useLocalization';

type TopicsTabProps = {
  isAuthenticated: boolean;
};

const TopicsTab: React.FC<TopicsTabProps> = ({ isAuthenticated }) => {
  const [allTopics] = useState<TaskTopic[]>(Object.values(TaskTopic));
  const [playerTopics, setPlayerTopics] = useState<PlayerTaskTopic[]>([]);
  const [originalTopics, setOriginalTopics] = useState<PlayerTaskTopic[]>([]);
  const [firstTime, setFirstTime] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);
  const navigate = useNavigate();
  const { t } = useLocalization();

  // Загружаем топики пользователя только при монтировании компонента и если авторизованы
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      api.getUserTopics()
        .then((res: GetPlayerTopicsResponse) => {
          setPlayerTopics(res.playerTaskTopics);
          // Сохраняем только активные топики как исходные для сравнения
          const activeTopics = res.playerTaskTopics.filter(pt => pt.isActive);
          setOriginalTopics(activeTopics);
          // firstTime определяется по пустоте списка активных топиков
          setFirstTime(activeTopics.length === 0);
          setLoading(false);
          // Запускаем анимацию появления контента
          setTimeout(() => {
            setContentLoaded(true);
          }, 50);
        })
        .catch((error: any) => {
          console.error('Error getting player topics:', error);
          setLoading(false);
          setTimeout(() => {
            setContentLoaded(true);
          }, 50);
        });
    } else {
      setLoading(false);
      setContentLoaded(true);
    }
  }, [isAuthenticated]);

  // Проверяем, изменились ли активные топики
  const hasChanges = () => {
    const currentActiveTopics = playerTopics.filter(pt => pt.isActive);
    if (currentActiveTopics.length !== originalTopics.length) return true;
    return !currentActiveTopics.every((pt) => 
      originalTopics.some(opt => opt.taskTopic === pt.taskTopic)
    );
  };

  const canSave = playerTopics.some(pt => pt.isActive) && (firstTime || hasChanges());

  const handleToggle = (topic: TaskTopic) => {
    setPlayerTopics((prev) => {
      const existingTopic = prev.find(pt => pt.taskTopic === topic);
      if (existingTopic) {
        // Если топик уже есть, переключаем его активность
        return prev.map(pt => 
          pt.taskTopic === topic 
            ? { ...pt, isActive: !pt.isActive }
            : pt
        );
      } else {
        // Если топика нет, добавляем его как активный с базовым уровнем
        return [...prev, {
          id: `temp-${topic}-${Date.now()}`, // Временный ID для новых топиков
          version: 1,
          taskTopic: topic,
          isActive: true,
          level: {
            id: `temp-level-${topic}-${Date.now()}`,
            version: 1,
            level: 1,
            totalExperience: 0,
            currentExperience: 0,
            experienceToNextLevel: 100,
            assessment: Assessment.E
          }
        }];
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    
    // Отправляем только измененные топики
    const changedTopics = playerTopics.filter(pt => {
      const originalTopic = originalTopics.find(opt => opt.taskTopic === pt.taskTopic);
      return !originalTopic || originalTopic.isActive !== pt.isActive;
    });
    
    if (changedTopics.length > 0) {
      await api.saveUserTopics(changedTopics);
    }
    
    if (firstTime) {
      await api.generateTasks();
    }
    
    setSaving(false);
    if (firstTime) {
      navigate('/tasks');
    }
    
    const updatedTopics = await api.getUserTopics();
    setPlayerTopics(updatedTopics.playerTaskTopics || []);
    // В originalTopics сохраняем только активные топики
    const activeTopics = (updatedTopics.playerTaskTopics || []).filter(pt => pt.isActive);
    setOriginalTopics(activeTopics);
  };


  // Определяем цветовые схемы для разных топиков в стиле Solo Leveling
  const getTopicColorScheme = (topic: TaskTopic) => {
    const colorSchemes = {
      PHYSICAL_ACTIVITY: {
        accentColor: 'rgba(220, 38, 38, 0.6)',
        borderColor: 'rgba(220, 38, 38, 0.3)',
        bgGradient: 'linear-gradient(135deg, rgba(220, 38, 38, 0.15) 0%, rgba(185, 28, 28, 0.08) 100%)',
        selectedBgGradient: 'linear-gradient(135deg, rgba(220, 38, 38, 0.25) 0%, rgba(185, 28, 28, 0.15) 100%)',
        glow: '0 0 20px rgba(220, 38, 38, 0.3)',
      },
      MENTAL_HEALTH: {
        accentColor: 'rgba(168, 85, 247, 0.6)',
        borderColor: 'rgba(168, 85, 247, 0.3)',
        bgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15) 0%, rgba(147, 51, 234, 0.08) 100%)',
        selectedBgGradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.25) 0%, rgba(147, 51, 234, 0.15) 100%)',
        glow: '0 0 20px rgba(168, 85, 247, 0.3)',
      },
      EDUCATION: {
        accentColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 0.3)',
        bgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%)',
        selectedBgGradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(37, 99, 235, 0.15) 100%)',
        glow: '0 0 20px rgba(59, 130, 246, 0.3)',
      },
      CREATIVITY: {
        accentColor: 'rgba(236, 72, 153, 0.6)',
        borderColor: 'rgba(236, 72, 153, 0.3)',
        bgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(219, 39, 119, 0.08) 100%)',
        selectedBgGradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.25) 0%, rgba(219, 39, 119, 0.15) 100%)',
        glow: '0 0 20px rgba(236, 72, 153, 0.3)',
      },
      SOCIAL_SKILLS: {
        accentColor: 'rgba(234, 179, 8, 0.6)',
        borderColor: 'rgba(234, 179, 8, 0.3)',
        bgGradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.15) 0%, rgba(202, 138, 4, 0.08) 100%)',
        selectedBgGradient: 'linear-gradient(135deg, rgba(234, 179, 8, 0.25) 0%, rgba(202, 138, 4, 0.15) 100%)',
        glow: '0 0 20px rgba(234, 179, 8, 0.3)',
      },
      HEALTHY_EATING: {
        accentColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 0.3)',
        bgGradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.15) 0%, rgba(22, 163, 74, 0.08) 100%)',
        selectedBgGradient: 'linear-gradient(135deg, rgba(34, 197, 94, 0.25) 0%, rgba(22, 163, 74, 0.15) 100%)',
        glow: '0 0 20px rgba(34, 197, 94, 0.3)',
      },
      PRODUCTIVITY: {
        accentColor: 'rgba(249, 115, 22, 0.6)',
        borderColor: 'rgba(249, 115, 22, 0.3)',
        bgGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.15) 0%, rgba(234, 88, 12, 0.08) 100%)',
        selectedBgGradient: 'linear-gradient(135deg, rgba(249, 115, 22, 0.25) 0%, rgba(234, 88, 12, 0.15) 100%)',
        glow: '0 0 20px rgba(249, 115, 22, 0.3)',
      },
      EXPERIMENTS: {
        accentColor: 'rgba(6, 182, 212, 0.6)',
        borderColor: 'rgba(6, 182, 212, 0.3)',
        bgGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 145, 178, 0.08) 100%)',
        selectedBgGradient: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(8, 145, 178, 0.15) 100%)',
        glow: '0 0 20px rgba(6, 182, 212, 0.3)',
      },
      ECOLOGY: {
        accentColor: 'rgba(132, 204, 22, 0.6)',
        borderColor: 'rgba(132, 204, 22, 0.3)',
        bgGradient: 'linear-gradient(135deg, rgba(132, 204, 22, 0.15) 0%, rgba(101, 163, 13, 0.08) 100%)',
        selectedBgGradient: 'linear-gradient(135deg, rgba(132, 204, 22, 0.25) 0%, rgba(101, 163, 13, 0.15) 100%)',
        glow: '0 0 20px rgba(132, 204, 22, 0.3)',
      },
      TEAMWORK: {
        accentColor: 'rgba(99, 102, 241, 0.6)',
        borderColor: 'rgba(99, 102, 241, 0.3)',
        bgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(79, 70, 229, 0.08) 100%)',
        selectedBgGradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.25) 0%, rgba(79, 70, 229, 0.15) 100%)',
        glow: '0 0 20px rgba(99, 102, 241, 0.3)',
      },
    };
    return colorSchemes[topic] || colorSchemes.EDUCATION;
  };

  if (loading) {
    return <TopicsTabSkeleton />;
  }

  return (
    <div
      className={`fixed inset-0 overflow-y-auto overflow-x-hidden ${contentLoaded ? 'tab-content-enter-active' : ''}`}
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #0a0e1a 50%, #0d1220 100%)',
        boxSizing: 'border-box',
        opacity: contentLoaded ? 1 : 0,
        transform: contentLoaded ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
      }}
    >
      {/* Holographic grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(200, 230, 245, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 230, 245, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center center'
        }}></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15" style={{
        background: 'rgba(180, 216, 232, 0.8)'
      }}></div>
      <div className="absolute bottom-1/3 right-1/3 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-10" style={{
        background: 'rgba(200, 230, 245, 0.6)'
      }}></div>

      <div className="relative z-10 min-h-screen pt-16 md:pt-20 px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-tech font-bold mb-3 tracking-tight"
            style={{
              color: '#e8f4f8',
              textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
            }}
          >
            {t('topics.title')}
          </h1>
          <p
            className="mb-6 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto px-4"
            style={{
              color: 'rgba(220, 235, 245, 0.7)',
              textShadow: '0 0 4px rgba(180, 220, 240, 0.1)'
            }}
          >
            {t('topics.subtitle')}
          </p>
          <div
            className="w-24 sm:w-32 md:w-40 h-1 rounded-full mx-auto"
            style={{
              background: 'rgba(180, 220, 240, 0.6)',
              boxShadow: '0 0 8px rgba(180, 220, 240, 0.4)'
            }}
          ></div>
        </div>

        {/* Topics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {allTopics.map((topic, index) => {
            const playerTopic = playerTopics.find(pt => pt.taskTopic === topic);
            const isSelected = playerTopic?.isActive || false;
            const colorScheme = getTopicColorScheme(topic);
            // Always calculate exp percentage, default to 0 if no level data
            const currentExp = playerTopic?.level?.currentExperience || 0;
            const maxExp = playerTopic?.level?.experienceToNextLevel || 100;
            const expPercentage = Math.min(100, Math.round((currentExp / maxExp) * 100));
            
            return (
              <button
                key={topic}
                type="button"
                onClick={() => handleToggle(topic)}
                className="group relative p-4 sm:p-6 rounded-2xl md:rounded-3xl transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  background: isSelected 
                    ? colorScheme.selectedBgGradient 
                    : 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: isSelected 
                    ? `2px solid ${colorScheme.borderColor}` 
                    : '2px solid rgba(220, 235, 245, 0.2)',
                  boxShadow: isSelected 
                    ? `${colorScheme.glow}, inset 0 0 20px rgba(200, 230, 245, 0.03)`
                    : '0 0 15px rgba(180, 220, 240, 0.1), inset 0 0 20px rgba(200, 230, 245, 0.02)',
                  animationDelay: `${index * 50}ms`,
                }}
              >
                {/* Glowing orbs */}
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl opacity-10" style={{
                  background: colorScheme.accentColor
                }}></div>
                <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full blur-lg opacity-10" style={{
                  background: colorScheme.accentColor
                }}></div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div
                    className="mb-3 sm:mb-4 transition-transform duration-200 flex justify-center items-center"
                    style={{
                      transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                      filter: isSelected ? `drop-shadow(0 0 8px ${colorScheme.accentColor})` : 'none',
                      color: isSelected ? colorScheme.accentColor : 'rgba(220, 235, 245, 0.8)'
                    }}
                  >
                    <TopicIcon 
                      topic={topic}
                      size={48}
                      className="text-3xl sm:text-4xl"
                    />
                  </div>

                  {/* Label */}
                  <div
                    className="text-xs sm:text-sm font-tech font-semibold leading-tight mb-2 transition-colors duration-200"
                    style={{
                      color: isSelected ? '#e8f4f8' : 'rgba(220, 235, 245, 0.8)',
                      textShadow: isSelected ? `0 0 4px ${colorScheme.accentColor}` : '0 0 2px rgba(180, 220, 240, 0.2)'
                    }}
                  >
                    {t(`topics.labels.${topic}`)}
                  </div>

                  {/* Level and Progress - Always show for consistent card sizes */}
                  <div className="space-y-2">
                    {/* Level Badge */}
                    <div 
                      className="inline-flex items-center px-2 py-1 rounded-full border text-xs font-tech font-bold"
                      style={{
                        background: 'rgba(220, 235, 245, 0.1)',
                        borderColor: 'rgba(220, 235, 245, 0.2)',
                        color: '#e8f4f8'
                      }}
                    >
                      {t('profile.tabs.level')} {playerTopic?.level?.level || 1}
                    </div>
                    
                    {/* Experience Progress */}
                    <div className="space-y-1">
                      <div 
                        className="text-[10px] font-tech"
                        style={{ color: 'rgba(220, 235, 245, 0.7)' }}
                      >
                        {playerTopic?.level?.currentExperience || 0} / {playerTopic?.level?.experienceToNextLevel || 100}
                      </div>
                      <div 
                        className="relative w-full rounded-full h-1.5 overflow-hidden"
                        style={{
                          background: 'rgba(220, 235, 245, 0.1)',
                          border: '1px solid rgba(220, 235, 245, 0.2)'
                        }}
                      >
                        <div
                          className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${expPercentage}%`,
                            background: `linear-gradient(90deg, ${colorScheme.accentColor} 0%, ${colorScheme.accentColor.replace('0.6', '0.4')} 100%)`,
                            boxShadow: `0 0 8px ${colorScheme.accentColor}`,
                            minWidth: expPercentage > 0 ? '4px' : '0px'
                          }}
                        ></div>
                        {/* Shimmer effect - всегда на всю ширину контейнера */}
                          {expPercentage > 0 && (
                            <div 
                            className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
                              style={{
                              width: '100%',
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
              </button>
            );
          })}
        </div>

        {/* Info section */}
        <div className="flex justify-center mb-8 md:mb-10 mt-20 md:mt-24 pb-24 md:pb-28">
          <div 
            className="relative overflow-hidden rounded-2xl md:rounded-3xl p-6 max-w-2xl w-full"
            style={{
              background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '2px solid rgba(220, 235, 245, 0.2)',
              boxShadow: `
                0 0 20px rgba(180, 220, 240, 0.15),
                inset 0 0 20px rgba(200, 230, 245, 0.03)
              `
            }}
          >
            {/* Glowing orbs */}
            <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-10" style={{
              background: 'rgba(180, 216, 232, 0.8)'
            }}></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 rounded-full blur-xl opacity-10" style={{
              background: 'rgba(200, 230, 245, 0.6)'
            }}></div>

            <div className="relative z-10">
              <div className="flex items-start">
                <div 
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mr-4 flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(180, 220, 240, 0.2) 0%, rgba(160, 210, 235, 0.1) 100%)',
                    border: '1px solid rgba(180, 220, 240, 0.3)',
                    boxShadow: '0 0 10px rgba(180, 220, 240, 0.2)'
                  }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: '#e8f4f8' }}
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
                  <h3 
                    className="font-tech font-bold mb-2 text-lg"
                    style={{
                      color: '#e8f4f8',
                      textShadow: '0 0 4px rgba(180, 220, 240, 0.2)'
                    }}
                  >
                    {firstTime ? t('topics.info.welcome.title') : t('topics.info.preferences.title')}
                  </h3>
                  <p 
                    className="text-sm leading-relaxed"
                    style={{
                      color: 'rgba(220, 235, 245, 0.7)',
                      textShadow: '0 0 2px rgba(180, 220, 240, 0.1)'
                    }}
                  >
                    {firstTime
                      ? t('topics.info.welcome.description')
                      : t('topics.info.preferences.description')
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky Save Button - Only show when there are changes */}
      {(hasChanges() || firstTime) && canSave && (
        <div 
          className="sticky bottom-0 left-0 right-0 z-50 px-4 md:px-6 pointer-events-none"
          style={{
            paddingTop: '1rem',
            paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px) + 1rem)', // Отступ от нижнего бара (80px высота + safe area + дополнительный отступ)
            background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0.4) 50%, transparent 100%)'
          }}
        >
          <div className="flex justify-end">
            <div className="pointer-events-auto">
              {/* Save Button - Compact mode */}
              <button
                onClick={handleSave}
                disabled={saving || !canSave}
                className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-tech font-semibold text-sm md:text-base transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                style={{
                  background: 'linear-gradient(135deg, rgba(180, 220, 240, 1) 0%, rgba(160, 210, 235, 0.95) 100%)',
                  border: '2px solid rgba(180, 220, 240, 1)',
                  color: '#0a0e1a',
                  boxShadow: '0 0 35px rgba(180, 220, 240, 0.7), 0 0 70px rgba(180, 220, 240, 0.4), inset 0 0 25px rgba(180, 220, 240, 0.15)',
                  textShadow: '0 0 12px rgba(180, 220, 240, 0.6)',
                  minWidth: '160px',
                  width: 'auto'
                }}
              >
                {saving ? (
                  <>
                    <div 
                      className="animate-spin w-3.5 h-3.5 md:w-4 md:h-4 border-2 rounded-full mr-2 flex-shrink-0"
                      style={{
                        borderColor: 'rgba(220, 235, 245, 0.2)',
                        borderTopColor: 'rgba(180, 220, 240, 0.6)'
                      }}
                    ></div>
                    <span className="whitespace-nowrap text-xs md:text-sm truncate">{t('topics.saving')}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1.5 md:mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                    </svg>
                    <span className="whitespace-nowrap text-xs md:text-sm">{t('topics.save')}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes pulse-glow {
          0%, 100% { 
            box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.5),
                        0 0 25px rgba(180, 220, 240, 0.3),
                        inset 0 0 20px rgba(200, 230, 245, 0.05);
          }
          50% { 
            box-shadow: 0 -4px 30px rgba(0, 0, 0, 0.5),
                        0 0 35px rgba(180, 220, 240, 0.5),
                        inset 0 0 20px rgba(200, 230, 245, 0.08);
          }
        }
        @keyframes pulse-dot {
          0%, 100% { 
            opacity: 1;
            transform: scale(1);
          }
          50% { 
            opacity: 0.7;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};

// Skeleton component for TopicsTab
const TopicsTabSkeleton: React.FC = () => {
  const allTopics = Object.values(TaskTopic);

  return (
    <div
      className="fixed inset-0 overflow-y-auto overflow-x-hidden"
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #0a0e1a 50%, #0d1220 100%)',
        boxSizing: 'border-box',
      }}
    >
      {/* Holographic grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(200, 230, 245, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 230, 245, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center center'
        }}></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15" style={{
        background: 'rgba(180, 216, 232, 0.8)'
      }}></div>
      <div className="absolute bottom-1/3 right-1/3 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-10" style={{
        background: 'rgba(200, 230, 245, 0.6)'
      }}></div>

      <div className="relative z-10 min-h-screen pt-16 md:pt-20 px-4 md:px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="h-8 md:h-10 w-48 md:w-64 mx-auto mb-3 rounded-lg animate-pulse"
            style={{
              background: 'rgba(220, 235, 245, 0.1)'
            }}
          ></div>
          <div
            className="h-4 md:h-5 w-72 md:w-96 mx-auto mb-6 rounded-lg animate-pulse"
            style={{
              background: 'rgba(220, 235, 245, 0.08)'
            }}
          ></div>
          <div
            className="w-24 sm:w-32 md:w-40 h-1 rounded-full mx-auto"
            style={{
              background: 'rgba(180, 220, 240, 0.6)',
              boxShadow: '0 0 8px rgba(180, 220, 240, 0.4)'
            }}
          ></div>
        </div>

        {/* Topics Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {allTopics.map((topic, index) => (
            <div
              key={topic}
              className="relative p-4 sm:p-6 rounded-2xl md:rounded-3xl animate-pulse"
              style={{
                background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(220, 235, 245, 0.2)',
                boxShadow: '0 0 15px rgba(180, 220, 240, 0.1), inset 0 0 20px rgba(200, 230, 245, 0.02)',
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Glowing orbs */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl opacity-10" style={{
                background: 'rgba(180, 216, 232, 0.8)'
              }}></div>
              <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full blur-lg opacity-10" style={{
                background: 'rgba(200, 230, 245, 0.6)'
              }}></div>

              <div className="relative z-10 text-center">
                {/* Icon skeleton */}
                <div
                  className="mb-3 sm:mb-4 flex justify-center items-center"
                >
                  <div
                    className="w-12 h-12 rounded-lg"
                    style={{
                      background: 'rgba(220, 235, 245, 0.1)'
                    }}
                  ></div>
                </div>

                {/* Label skeleton */}
                <div
                  className="h-4 w-20 mx-auto mb-2 rounded"
                  style={{
                    background: 'rgba(220, 235, 245, 0.1)'
                  }}
                ></div>

                {/* Level and Progress skeleton - Always show for consistent sizes */}
                <div className="space-y-2">
                  {/* Level Badge skeleton */}
                  <div 
                    className="inline-flex items-center px-2 py-1 rounded-full h-6 w-16 mx-auto"
                    style={{
                      background: 'rgba(220, 235, 245, 0.1)',
                      border: '1px solid rgba(220, 235, 245, 0.2)'
                    }}
                  ></div>
                  
                  {/* Experience Progress skeleton */}
                  <div className="space-y-1">
                    <div 
                      className="h-3 w-20 mx-auto rounded"
                      style={{
                        background: 'rgba(220, 235, 245, 0.1)'
                      }}
                    ></div>
                    <div 
                      className="relative w-full rounded-full h-1.5 overflow-hidden"
                      style={{
                        background: 'rgba(220, 235, 245, 0.1)',
                        border: '1px solid rgba(220, 235, 245, 0.2)'
                      }}
                    >
                      <div
                        className="absolute top-0 left-0 h-full rounded-full w-1/2"
                        style={{
                          background: 'rgba(220, 235, 245, 0.1)'
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info section skeleton */}
        <div className="flex justify-center mb-6">
          <div 
            className="relative overflow-hidden rounded-2xl md:rounded-3xl p-6 mb-8 max-w-2xl w-full"
            style={{
              background: 'rgba(220, 235, 245, 0.05)',
              border: '2px solid rgba(220, 235, 245, 0.1)'
            }}
          >
            <div className="flex items-start">
              <div 
                className="w-10 h-10 rounded-2xl mr-4 flex-shrink-0"
                style={{
                  background: 'rgba(220, 235, 245, 0.1)'
                }}
              ></div>
              <div className="flex-1 space-y-2">
                <div 
                  className="h-5 w-48 rounded"
                  style={{
                    background: 'rgba(220, 235, 245, 0.1)'
                  }}
                ></div>
                <div 
                  className="h-4 w-full rounded"
                  style={{
                    background: 'rgba(220, 235, 245, 0.08)'
                  }}
                ></div>
                <div 
                  className="h-4 w-3/4 rounded"
                  style={{
                    background: 'rgba(220, 235, 245, 0.08)'
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicsTab;
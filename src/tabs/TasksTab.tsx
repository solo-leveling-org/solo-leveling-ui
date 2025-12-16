import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { PlayerTask, Stamina } from '../api';
import { api } from '../services';
import { useLocalization } from '../hooks/useLocalization';
import { useTasksRefresh } from '../hooks/useTasksRefresh';
import TasksSection from '../components/TasksSection';
import TopicsSection from '../components/TopicsSection';
import TaskCardSkeleton from '../components/TaskCardSkeleton';
import Icon from '../components/Icon';
import StaminaIndicator from '../components/StaminaIndicator';
import StaminaIndicatorSkeleton from '../components/StaminaIndicatorSkeleton';

type TasksTabProps = {
  isAuthenticated: boolean;
};

type TabViewMode = 'tasks' | 'topics';
type TaskViewMode = 'active' | 'completed';

const TasksTab: React.FC<TasksTabProps> = ({ isAuthenticated }) => {
  const [tasks, setTasks] = useState<PlayerTask[]>([]);
  const [stamina, setStamina] = useState<Stamina | null>(null);
  const [firstTime, setFirstTime] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tabMode, setTabMode] = useState<TabViewMode>('tasks');
  const [displayTabMode, setDisplayTabMode] = useState<TabViewMode>('tasks');
  const [isTabTransitioning, setIsTabTransitioning] = useState(false);
  const [taskViewMode, setTaskViewMode] = useState<TaskViewMode>('active');
  const [displayTaskViewMode, setDisplayTaskViewMode] = useState<TaskViewMode>('active');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const hasLoadedRef = useRef(false);
  const scrollPositionRef = useRef<number>(0);
  const { t } = useLocalization();

  // Функция для обновления списка задач и стамины
  const handleTasksUpdate = useCallback((newTasks: PlayerTask[], newStamina?: Stamina, newFirstTime?: boolean) => {
    setTasks(newTasks);
    if (newStamina) {
      setStamina(newStamina);
    }
    if (newFirstTime !== undefined) {
      setFirstTime(newFirstTime);
    }
    // Если задачи появились, значит firstTime стал false
    if (newTasks.length > 0) {
      setFirstTime(false);
    }
    setLoading(false);
  }, []);

  // Используем хук для автоматического обновления задач при уведомлениях
  useTasksRefresh({
    isAuthenticated,
    onTasksUpdate: handleTasksUpdate,
  });

  // Загружаем задачи только при монтировании компонента и если авторизованы
  // Используем useRef, чтобы гарантировать, что запрос выполнится только один раз
  useEffect(() => {
    if (isAuthenticated && !hasLoadedRef.current) {
      hasLoadedRef.current = true;
      setContentLoaded(false);
      setLoading(true);
      // Делаем запрос только один раз при монтировании
      api.getPlayerTasks()
        .then((res) => {
          handleTasksUpdate(res.tasks, res.stamina, res.firstTime);
          // Если firstTime, перенаправляем в топики
          if (res.firstTime) {
            setTabMode('topics');
            setDisplayTabMode('topics');
          }
          // Запускаем анимацию появления контента
          setTimeout(() => {
            setContentLoaded(true);
          }, 50);
        })
        .catch((error) => {
          console.error('Error getting tasks:', error);
          setLoading(false);
          setTimeout(() => {
            setContentLoaded(true);
          }, 50);
        });
    } else if (!isAuthenticated) {
      // Если не авторизованы, не показываем loading
      setLoading(false);
      setContentLoaded(true);
      hasLoadedRef.current = false; // Сбрасываем флаг при разлогине
    }
  }, [isAuthenticated, handleTasksUpdate]);

  // Обработчик переключения на топики
  const handleGoToTopics = useCallback(() => {
    if (tabMode !== 'topics') {
      setIsTabTransitioning(true);
      setTimeout(() => {
        setTabMode('topics');
        setTimeout(() => {
          setIsTabTransitioning(false);
          setDisplayTabMode('topics');
        }, 25);
      }, 100);
    }
  }, [tabMode]);

  // Обработчик возврата к задачам
  const handleBackToTasks = useCallback(() => {
    if (tabMode !== 'tasks') {
      setIsTabTransitioning(true);
      setTimeout(() => {
        setTabMode('tasks');
        setTimeout(() => {
          setIsTabTransitioning(false);
          setDisplayTabMode('tasks');
        }, 25);
      }, 100);
    }
  }, [tabMode]);

  // Обработчик сохранения топиков (переключаемся обратно на активные задачи)
  const handleTopicsSave = useCallback(() => {
    setIsTabTransitioning(true);
    setTimeout(() => {
      setTabMode('tasks');
      setTaskViewMode('active');
      setDisplayTaskViewMode('active');
      // Перезагружаем задачи после сохранения топиков
      if (isAuthenticated) {
        api.getPlayerTasks()
          .then((res) => {
            setTasks(res.tasks);
            setStamina(res.stamina);
            setFirstTime(res.firstTime);
            setTimeout(() => {
              setIsTabTransitioning(false);
              setDisplayTabMode('tasks');
            }, 25);
          })
          .catch((error) => {
            console.error('Error getting tasks after topics save:', error);
            setTimeout(() => {
              setIsTabTransitioning(false);
              setDisplayTabMode('tasks');
            }, 25);
          });
      } else {
        setTimeout(() => {
          setIsTabTransitioning(false);
          setDisplayTabMode('tasks');
        }, 25);
      }
    }, 100);
  }, [isAuthenticated]);

  // Показываем skeleton во время загрузки
  if (loading && tabMode === 'tasks') {
    return (
      <div 
        className="fixed inset-0 overflow-y-auto overflow-x-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #000000 0%, #0a0e1a 50%, #0d1220 100%)',
          boxSizing: 'border-box'
        }}
      >
        <div className="relative z-10 min-h-screen pt-16 md:pt-20 px-4 md:px-6 pb-24">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header skeleton */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <div className="h-8 md:h-10 rounded-lg w-48 sm:w-64 mx-auto mb-3 animate-pulse" style={{
                  background: 'rgba(220, 235, 245, 0.1)'
                }}></div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 rounded-lg w-full max-w-2xl mx-auto animate-pulse" style={{
                    background: 'rgba(220, 235, 245, 0.1)'
                  }}></div>
                  <div className="h-4 rounded-lg w-3/4 max-w-xl mx-auto animate-pulse" style={{
                    background: 'rgba(220, 235, 245, 0.1)'
                  }}></div>
                </div>
                <div className="w-24 sm:w-32 md:w-40 h-1 rounded-full mx-auto animate-pulse" style={{
                  background: 'rgba(180, 220, 240, 0.6)',
                  boxShadow: '0 0 8px rgba(180, 220, 240, 0.4)'
                }}></div>
              </div>

              {/* Main Navigation skeleton */}
              <div className="flex justify-center mb-6">
                <div 
                  className="inline-flex rounded-full p-1"
                  style={{
                    background: 'rgba(220, 235, 245, 0.08)',
                    border: '1px solid rgba(220, 235, 245, 0.12)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div className="inline-flex gap-2">
                    <div className="px-5 md:px-7 py-2 rounded-full animate-pulse" style={{
                      background: 'rgba(220, 235, 245, 0.15)',
                      width: '120px'
                    }}></div>
                    <div className="px-5 md:px-7 py-2 rounded-full animate-pulse" style={{
                      background: 'rgba(220, 235, 245, 0.1)',
                      width: '120px'
                    }}></div>
                  </div>
                </div>
              </div>

              {/* Task View Mode Toggle skeleton */}
              <div className="flex justify-center mb-6">
                <div
                  className="inline-flex rounded-full p-1"
                  style={{
                    background: 'rgba(220, 235, 245, 0.08)',
                    border: '1px solid rgba(220, 235, 245, 0.12)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div className="inline-flex gap-2">
                    <div className="px-6 md:px-8 py-2.5 md:py-3 rounded-full animate-pulse" style={{
                      background: 'rgba(220, 235, 245, 0.15)',
                      width: '100px'
                    }}></div>
                    <div className="px-6 md:px-8 py-2.5 md:py-3 rounded-full animate-pulse" style={{
                      background: 'rgba(220, 235, 245, 0.1)',
                      width: '120px'
                    }}></div>
                  </div>
                </div>
              </div>

              {/* Stamina Indicator skeleton */}
              <div className="flex justify-center mb-6 px-4">
                <div className="w-full max-w-md">
                  <StaminaIndicatorSkeleton />
                </div>
              </div>
            </div>

            {/* Tasks grid skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <TaskCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
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
      <div className={`relative z-10 min-h-screen pt-16 md:pt-20 px-4 md:px-6 ${displayTabMode === 'topics' ? '' : 'pb-24'}`}>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="mb-8">
            <div className="text-center mb-6">
              <h1 
                className="text-2xl sm:text-3xl md:text-4xl font-tech font-bold mb-3 tracking-tight"
                style={{
                  color: '#e8f4f8',
                  textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
                }}
              >
                {t('tasks.title')}
              </h1>

              <p 
                className="mb-6 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto px-4"
                style={{
                  color: 'rgba(220, 235, 245, 0.7)'
                }}
              >
                {t('tasks.subtitle')}
              </p>

              {/* Divider */}
              <div
                className="w-24 sm:w-32 md:w-40 h-1 rounded-full mx-auto mb-6"
                style={{
                  background: 'rgba(180, 220, 240, 0.6)',
                  boxShadow: '0 0 8px rgba(180, 220, 240, 0.4)'
                }}
              ></div>
            </div>

            {/* Main Navigation - Minimal iOS Segmented Control Style */}
            <div className={`flex justify-center ${firstTime ? 'mb-4' : 'mb-6'}`}>
              <div 
                className="inline-flex rounded-full p-1"
                style={{
                  background: 'rgba(220, 235, 245, 0.08)',
                  border: '1px solid rgba(220, 235, 245, 0.12)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <button
                  onClick={handleBackToTasks}
                  className={`relative px-5 md:px-7 py-2 rounded-full font-tech font-medium text-sm md:text-base transition-all duration-200 flex items-center gap-2 ${
                    tabMode === 'tasks' ? '' : 'opacity-60 hover:opacity-80'
                  }`}
                  style={tabMode === 'tasks' ? {
                    background: 'rgba(220, 235, 245, 0.15)',
                    color: '#e8f4f8',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  } : {
                    background: 'transparent',
                    color: 'rgba(220, 235, 245, 0.7)'
                  }}
                >
                  <Icon 
                    type="clipboard" 
                    size={16}
                  />
                  <span>{t('navigation.tasks')}</span>
                </button>
                <button
                  onClick={handleGoToTopics}
                  className={`relative px-5 md:px-7 py-2 rounded-full font-tech font-medium text-sm md:text-base transition-all duration-200 flex items-center gap-2 ${
                    tabMode === 'topics' ? '' : 'opacity-60 hover:opacity-80'
                  }`}
                  style={tabMode === 'topics' ? {
                    background: 'rgba(220, 235, 245, 0.15)',
                    color: '#e8f4f8',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                  } : {
                    background: 'transparent',
                    color: 'rgba(220, 235, 245, 0.7)'
                  }}
                >
                  <Icon 
                    type="target" 
                    size={16}
                  />
                  <span>{t('navigation.topics')}</span>
                </button>
              </div>
            </div>

            {/* Task View Mode Toggle - Same style as leaderboard */}
            {displayTabMode === 'tasks' && !firstTime && (
              <div className="flex justify-center mb-6">
                <div
                  className="inline-flex rounded-full p-1"
                  style={{
                    background: 'rgba(220, 235, 245, 0.08)',
                    border: '1px solid rgba(220, 235, 245, 0.12)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div className="inline-flex gap-2">
                    <button
                      onClick={() => {
                        if (taskViewMode !== 'active') {
                          // Сохраняем позицию скролла перед переходом
                          scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
                          setIsTransitioning(true);
                          setTimeout(() => {
                            setTaskViewMode('active');
                            setTimeout(() => {
                              setIsTransitioning(false);
                              setDisplayTaskViewMode('active');
                              
                              // Восстанавливаем позицию скролла после завершения анимации
                              requestAnimationFrame(() => {
                                window.scrollTo({
                                  top: scrollPositionRef.current,
                                  behavior: 'auto'
                                });
                              });
                            }, 25);
                          }, 100);
                        }
                      }}
                      className={`px-6 md:px-8 py-2.5 md:py-3 rounded-full font-tech font-semibold text-sm md:text-base transition-all duration-150 ease-in-out ${
                        taskViewMode === 'active' ? '' : 'opacity-50 hover:opacity-70'
                      }`}
                      style={taskViewMode === 'active' ? {
                        background: 'linear-gradient(135deg, rgba(180, 220, 240, 0.25) 0%, rgba(160, 210, 235, 0.15) 100%)',
                        border: '2px solid rgba(180, 220, 240, 0.4)',
                        color: '#e8f4f8',
                        boxShadow: '0 0 20px rgba(180, 220, 240, 0.3), inset 0 0 20px rgba(200, 230, 245, 0.05)',
                        textShadow: '0 0 4px rgba(180, 220, 240, 0.3)',
                        backdropFilter: 'blur(20px)'
                      } : {
                        background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.4) 0%, rgba(5, 8, 18, 0.6) 100%)',
                        border: '2px solid rgba(220, 235, 245, 0.2)',
                        color: 'rgba(220, 235, 245, 0.6)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {t('tasks.viewMode.active')}
                    </button>
                    <button
                      onClick={() => {
                        if (taskViewMode !== 'completed') {
                          // Сохраняем позицию скролла перед переходом
                          scrollPositionRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
                          setIsTransitioning(true);
                          setTimeout(() => {
                            setTaskViewMode('completed');
                            setTimeout(() => {
                              setIsTransitioning(false);
                              setDisplayTaskViewMode('completed');
                              
                              // Восстанавливаем позицию скролла после завершения анимации
                              requestAnimationFrame(() => {
                                window.scrollTo({
                                  top: scrollPositionRef.current,
                                  behavior: 'auto'
                                });
                              });
                            }, 25);
                          }, 100);
                        }
                      }}
                      className={`px-6 md:px-8 py-2.5 md:py-3 rounded-full font-tech font-semibold text-sm md:text-base transition-all duration-150 ease-in-out ${
                        taskViewMode === 'completed' ? '' : 'opacity-50 hover:opacity-70'
                      }`}
                      style={taskViewMode === 'completed' ? {
                        background: 'linear-gradient(135deg, rgba(180, 220, 240, 0.25) 0%, rgba(160, 210, 235, 0.15) 100%)',
                        border: '2px solid rgba(180, 220, 240, 0.4)',
                        color: '#e8f4f8',
                        boxShadow: '0 0 20px rgba(180, 220, 240, 0.3), inset 0 0 20px rgba(200, 230, 245, 0.05)',
                        textShadow: '0 0 4px rgba(180, 220, 240, 0.3)',
                        backdropFilter: 'blur(20px)'
                      } : {
                        background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.4) 0%, rgba(5, 8, 18, 0.6) 100%)',
                        border: '2px solid rgba(220, 235, 245, 0.2)',
                        color: 'rgba(220, 235, 245, 0.6)',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {t('tasks.viewMode.completed')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Stamina Indicator - показываем только для активных задач */}
            {displayTabMode === 'tasks' && !firstTime && displayTaskViewMode === 'active' && (
              <>
                {loading ? (
                  <div className="mb-6 md:flex md:justify-center">
                    <div className="w-full max-w-md mx-auto md:mx-0">
                      <StaminaIndicatorSkeleton />
                    </div>
                  </div>
                ) : stamina ? (
                  <div 
                    className="mb-6 md:flex md:justify-center"
                    style={{
                      opacity: isTransitioning ? 0 : 1,
                      transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
                      transition: 'opacity 0.15s ease-out, transform 0.15s ease-out'
                    }}
                  >
                    <div className="w-full max-w-md mx-auto md:mx-0">
                      <StaminaIndicator 
                        stamina={stamina} 
                        onStaminaUpdate={(updatedStamina) => {
                          setStamina(updatedStamina);
                        }}
                      />
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>

          {/* Content based on view mode */}
          <div
            style={{
              opacity: isTabTransitioning ? 0 : 1,
              transform: isTabTransitioning ? 'translateY(10px)' : 'translateY(0)',
              transition: 'opacity 0.15s ease-out, transform 0.15s ease-out'
            }}
          >
            {displayTabMode === 'topics' ? (
              <TopicsSection
                isAuthenticated={isAuthenticated}
                onSave={handleTopicsSave}
              />
            ) : (
              <div
                style={{
                  opacity: isTransitioning ? 0 : 1,
                  transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
                  transition: 'opacity 0.15s ease-out, transform 0.15s ease-out'
                }}
              >
                <TasksSection
                  tasks={tasks}
                  stamina={stamina}
                  loading={loading}
                  firstTime={firstTime}
                  onTasksUpdate={handleTasksUpdate}
                  onGoToTopics={handleGoToTopics}
                  initialViewMode={displayTaskViewMode}
                  isTransitioning={isTransitioning}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksTab; 
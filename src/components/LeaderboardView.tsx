import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { api } from '../services';
import type { LeaderboardUser } from '../api';
import { LeaderboardType } from '../api';
import Icon from './Icon';
import { cn } from '../utils';

type LeaderboardViewProps = {
  isAuthenticated: boolean;
  leaderboardType: LeaderboardType;
  onTypeChange: (type: LeaderboardType) => void;
  onUserClick?: (userId: number) => void;
};

const LeaderboardView: React.FC<LeaderboardViewProps> = ({ 
  isAuthenticated, 
  leaderboardType,
  onTypeChange,
  onUserClick
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { t } = useLocalization();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const currentPageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const isLoadingRef = useRef(false);
  const loadLeaderboardRef = useRef<typeof loadLeaderboard | undefined>(undefined);

  // Загрузка лидерборда с infinity scroll
  const loadLeaderboard = useCallback(async (page: number = 0, reset: boolean = false) => {
    if (!isAuthenticated) return;
    
    if (!reset && !hasMoreRef.current) return;
    if (isLoadingRef.current) return;
    
    isLoadingRef.current = true;
    
    if (reset) {
      setLoading(true);
      currentPageRef.current = 0;
    } else {
      setLoadingMore(true);
    }

    try {
      const response = await api.getUsersLeaderboard(
        leaderboardType,
        {},
        page,
        20
      );
      
      const newUsers = response.users || [];
      const hasMoreData = newUsers.length > 0 && (response.paging?.hasMore || false);
      
      if (reset) {
        setLeaderboard(newUsers);
        setHasMore(hasMoreData);
        currentPageRef.current = page; // Используем переданный page, а не 0
        hasMoreRef.current = hasMoreData;
        // После загрузки новых данных делаем fade-in
        setTimeout(() => {
          setIsTransitioning(false);
        }, 25);
      } else {
        if (newUsers.length > 0) {
          setLeaderboard(prev => [...prev, ...newUsers]);
          setHasMore(hasMoreData);
          currentPageRef.current = page;
          hasMoreRef.current = hasMoreData;
        } else {
          setHasMore(false);
          hasMoreRef.current = false;
        }
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [isAuthenticated, leaderboardType]);

  // Сохраняем актуальную версию функции в ref
  useEffect(() => {
    loadLeaderboardRef.current = loadLeaderboard;
  }, [loadLeaderboard]);

  // Настройка Intersection Observer для бесконечного скролла
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Не создаем observer если данных больше нет, идет загрузка или список пуст (первая загрузка)
    if (!hasMoreRef.current || loadingMore || isLoadingRef.current || leaderboard.length === 0) {
      return;
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMoreRef.current && !loadingMore && !isLoadingRef.current && leaderboard.length > 0) {
        const nextPage = currentPageRef.current + 1;
        loadLeaderboardRef.current?.(nextPage, false);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, { 
      threshold: 0,
      rootMargin: '200px'
    });

    const timeoutId = setTimeout(() => {
      if (loadMoreRef.current && observerRef.current && hasMoreRef.current && leaderboard.length > 0) {
        observerRef.current.observe(loadMoreRef.current);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, leaderboard.length]);

  // Загрузка при изменении типа с плавным переходом
  useEffect(() => {
    // Начинаем fade-out
    setIsTransitioning(true);
    
    // После fade-out загружаем новые данные
    const fadeOutTimeout = setTimeout(() => {
      hasMoreRef.current = true;
      currentPageRef.current = 0;
      loadLeaderboard(0, true);
    }, 100);
    
    return () => {
      clearTimeout(fadeOutTimeout);
    };
  }, [leaderboardType, loadLeaderboard]);

  const handleTypeChange = (type: LeaderboardType) => {
    onTypeChange(type);
  };

  // Получение текста для очков в зависимости от типа
  const getScoreLabel = (type: LeaderboardType): string => {
    switch (type) {
      case LeaderboardType.LEVEL:
        return t('collections.score.level');
      case LeaderboardType.BALANCE:
        return t('collections.score.balance');
      default:
        return t('collections.score.level');
    }
  };

  return (
    <div className="space-y-6">
      {/* Leaderboard Type Selector */}
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
          {[LeaderboardType.LEVEL, LeaderboardType.BALANCE].map((type) => {
            // TASKS временно скрыт, так как логика на бэкенде не готова
            if (type === LeaderboardType.TASKS) return null;
            return (
            <button
              key={type}
              onClick={() => handleTypeChange(type)}
              className={cn(
                "px-6 md:px-8 py-2.5 md:py-3 rounded-full font-tech font-semibold text-sm md:text-base transition-all duration-300 ease-in-out",
                leaderboardType === type ? '' : 'opacity-50 hover:opacity-70'
              )}
              style={leaderboardType === type ? {
                background: 'linear-gradient(135deg, rgba(180, 220, 240, 0.25) 0%, rgba(160, 210, 235, 0.15) 100%)',
                border: '2px solid rgba(180, 220, 240, 0.4)',
                color: '#e8f4f8',
                boxShadow: '0 0 20px rgba(180, 220, 240, 0.3), inset 0 0 20px rgba(200, 230, 245, 0.05)',
                textShadow: '0 0 4px rgba(180, 220, 240, 0.3)',
                backdropFilter: 'blur(20px)'
              } : {
                background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.4) 0%, rgba(5, 8, 18, 0.6) 100%)',
                border: '1px solid rgba(220, 235, 245, 0.2)',
                color: 'rgba(220, 235, 245, 0.6)',
                backdropFilter: 'blur(10px)'
              }}
            >
              {t(`collections.types.${type.toLowerCase()}`)}
            </button>
            );
          })}
        </div>
        </div>
      </div>

      {/* Leaderboard List */}
      {loading && leaderboard.length === 0 ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="rounded-xl p-4 animate-pulse"
              style={{
                background: 'rgba(220, 235, 245, 0.05)',
                border: '1px solid rgba(220, 235, 245, 0.1)'
              }}
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-12 h-12 rounded-full"
                  style={{
                    background: 'rgba(220, 235, 245, 0.1)'
                  }}
                ></div>
                <div className="flex-1">
                  <div
                    className="h-4 w-32 rounded mb-2"
                    style={{
                      background: 'rgba(220, 235, 245, 0.1)'
                    }}
                  ></div>
                  <div
                    className="h-3 w-24 rounded"
                    style={{
                      background: 'rgba(220, 235, 245, 0.08)'
                    }}
                  ></div>
                </div>
                <div
                  className="h-4 w-20 rounded"
                  style={{
                    background: 'rgba(220, 235, 245, 0.1)'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div 
            className="space-y-3"
            style={{
              opacity: isTransitioning ? 0 : 1,
              transform: isTransitioning ? 'translateY(10px)' : 'translateY(0)',
              transition: 'opacity 0.15s ease-out, transform 0.15s ease-out'
            }}
          >
            {leaderboard.map((user, index) => {
              const isTopThree = index < 3;
              const position = user.position;
              return (
                <button
                  key={user.id}
                  onClick={() => onUserClick?.(user.id)}
                  className="w-full rounded-xl p-4 transition-all duration-300 hover:scale-[1.02] text-left"
                  style={{
                    background: isTopThree
                      ? 'linear-gradient(135deg, rgba(180, 220, 240, 0.2) 0%, rgba(160, 210, 235, 0.12) 100%)'
                      : 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: isTopThree
                      ? '2px solid rgba(180, 220, 240, 0.5)'
                      : '1px solid rgba(220, 235, 245, 0.2)',
                    boxShadow: isTopThree
                      ? '0 0 25px rgba(180, 220, 240, 0.4), inset 0 0 25px rgba(200, 230, 245, 0.08), 0 0 40px rgba(180, 220, 240, 0.15)'
                      : '0 0 15px rgba(180, 220, 240, 0.1), inset 0 0 20px rgba(200, 230, 245, 0.02)'
                  }}
                >
                  <div className="flex items-center space-x-4">
                    {/* Position */}
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-tech font-bold text-lg"
                      style={{
                        background: isTopThree
                          ? position === 1
                            ? 'linear-gradient(135deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 165, 0, 0.2) 100%)'
                            : position === 2
                            ? 'linear-gradient(135deg, rgba(192, 192, 192, 0.3) 0%, rgba(160, 160, 160, 0.2) 100%)'
                            : 'linear-gradient(135deg, rgba(205, 127, 50, 0.3) 0%, rgba(160, 82, 45, 0.2) 100%)'
                          : 'rgba(220, 235, 245, 0.1)',
                        border: isTopThree
                          ? position === 1
                            ? '2px solid rgba(255, 215, 0, 0.6)'
                            : position === 2
                            ? '2px solid rgba(192, 192, 192, 0.6)'
                            : '2px solid rgba(205, 127, 50, 0.6)'
                          : '1px solid rgba(220, 235, 245, 0.2)',
                        color: isTopThree
                          ? position === 1
                            ? '#FFD700'
                            : position === 2
                            ? '#C0C0C0'
                            : '#CD7F32'
                          : '#e8f4f8',
                        boxShadow: isTopThree
                          ? position === 1
                            ? '0 0 20px rgba(255, 215, 0, 0.5), inset 0 0 15px rgba(255, 215, 0, 0.1)'
                            : position === 2
                            ? '0 0 20px rgba(192, 192, 192, 0.5), inset 0 0 15px rgba(192, 192, 192, 0.1)'
                            : '0 0 20px rgba(205, 127, 50, 0.5), inset 0 0 15px rgba(205, 127, 50, 0.1)'
                          : 'none',
                        backdropFilter: 'blur(10px)'
                      }}
                    >
                      {user.position}
                    </div>

                    {/* Avatar */}
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden"
                      style={{
                        border: '2px solid rgba(180, 220, 240, 0.4)',
                        boxShadow: '0 0 10px rgba(180, 220, 240, 0.3)'
                      }}
                    >
                      {user.photoUrl ? (
                        <img
                          src={user.photoUrl}
                          alt={`${user.firstName} ${user.lastName || ''}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, rgba(180, 220, 240, 0.3) 0%, rgba(160, 210, 235, 0.2) 100%)'
                          }}
                        >
                          <Icon type="user" size={24} />
                        </div>
                      )}
                    </div>

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-tech font-semibold text-base mb-1 truncate"
                        style={{
                          color: '#e8f4f8',
                          textShadow: '0 0 4px rgba(180, 220, 240, 0.2)'
                        }}
                      >
                        {user.firstName} {user.lastName || ''}
                      </div>
                      <div
                        className="text-sm font-tech"
                        style={{
                          color: 'rgba(220, 235, 245, 0.7)'
                        }}
                      >
                        {getScoreLabel(leaderboardType)}: {user.score}
                      </div>
                    </div>

                    {/* Trophy Icon for top 3 - только для визуального акцента */}
                    {isTopThree && (
                      <div
                        className="flex-shrink-0"
                        style={{
                          color: 'rgba(180, 220, 240, 0.9)',
                          filter: 'drop-shadow(0 0 8px rgba(180, 220, 240, 0.4))'
                        }}
                      >
                        <Icon type="trophy" size={20} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Индикатор загрузки */}
          {loadingMore && (
            <div className="flex justify-center py-4">
              <div 
                className="animate-spin rounded-full h-6 w-6 border-2"
                style={{
                  borderColor: 'rgba(220, 235, 245, 0.2)',
                  borderTopColor: 'rgba(180, 220, 240, 0.6)'
                }}
              ></div>
            </div>
          )}

          {/* Элемент для отслеживания скролла */}
          {hasMore && !loadingMore && (
            <div ref={loadMoreRef} className="h-20 flex items-center justify-center">
              <div className="text-xs font-tech" style={{ color: 'rgba(220, 235, 245, 0.5)' }}>
                Загрузка...
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default LeaderboardView;


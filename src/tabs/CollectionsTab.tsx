import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { useTelegramWebApp } from '../useTelegram';
import { LeaderboardType } from '../api';
import Icon from '../components/Icon';
import LeaderboardView from '../components/LeaderboardView';
import UserProfileView from '../components/UserProfileView';
import { cn } from '../utils';

type CollectionsTabProps = {
  isAuthenticated: boolean;
};

type TabMode = 'main' | 'leaderboard' | 'lootboxes' | 'inventory' | 'userProfile';

const CollectionsTab: React.FC<CollectionsTabProps> = ({ isAuthenticated }) => {
  const [tabMode, setTabMode] = useState<TabMode>('main');
  const [leaderboardType, setLeaderboardType] = useState<LeaderboardType>(LeaderboardType.LEVEL);
  const [contentLoaded, setContentLoaded] = useState(false);
  const [viewedUserId, setViewedUserId] = useState<number | null>(null);
  const { t } = useLocalization();
  const { backButton } = useTelegramWebApp();

  // Управление кнопкой "Назад" в Telegram
  useEffect(() => {
    if (tabMode !== 'main') {
      backButton.show();
    } else {
      backButton.hide();
    }
    
    const handleBack = () => {
      if (tabMode === 'userProfile') {
        // Возвращаемся в лидерборд
        setTabMode('leaderboard');
        setViewedUserId(null);
      } else {
        // Возвращаемся на главную
        setTabMode('main');
      }
    };
    
    backButton.onClick(handleBack);
    
    return () => {
      backButton.hide();
    };
  }, [backButton, tabMode]);

  useEffect(() => {
    setTimeout(() => {
      setContentLoaded(true);
    }, 50);
  }, [tabMode]);

  const handleTabChange = (mode: TabMode) => {
    if (mode === 'lootboxes' || mode === 'inventory') {
      return;
    }
    setTabMode(mode);
    setContentLoaded(false);
  };

  // Главная страница с карточками функционалов
  if (tabMode === 'main') {
    return (
      <div
        className={cn(
          "fixed inset-0 overflow-y-auto overflow-x-hidden",
          contentLoaded ? 'tab-content-enter-active' : ''
        )}
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #0a0e1a 50%, #0d1220 100%)',
          boxSizing: 'border-box',
          opacity: contentLoaded ? 1 : 0,
          transform: contentLoaded ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
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

        <div className="relative z-10 min-h-screen pt-16 md:pt-20 px-4 md:px-6 pb-24">
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Карточка Таблица лидеров */}
            <button
              onClick={() => handleTabChange('leaderboard')}
              className="w-full relative overflow-hidden rounded-3xl p-6 md:p-8 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group h-32 flex items-center"
              style={{
                background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(124, 58, 237, 0.15) 50%, rgba(99, 102, 241, 0.2) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(139, 92, 246, 0.4)',
                boxShadow: '0 0 30px rgba(139, 92, 246, 0.25), inset 0 0 30px rgba(139, 92, 246, 0.05)'
              }}
            >
              {/* Holographic shimmer effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                background: 'linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(0, 255, 255, 0.15) 25%, rgba(124, 58, 237, 0.1) 50%, rgba(0, 255, 255, 0.15) 75%, rgba(0, 212, 255, 0.1) 100%)',
                backgroundSize: '200% 200%',
                animation: 'holographic-shimmer 4s ease-in-out infinite'
              }}></div>
              
              <div className="flex items-center justify-between w-full relative z-10">
                <div className="flex-1">
                  <h2
                    className="text-3xl md:text-4xl font-tech font-bold"
                    style={{
                      color: '#e8f4f8',
                      textShadow: '0 0 10px rgba(139, 92, 246, 0.4)'
                    }}
                  >
                    {t('collections.tabs.leaderboard')}
                  </h2>
                </div>
                <div
                  className="flex-shrink-0"
                  style={{
                    color: 'rgba(139, 92, 246, 1)',
                    filter: 'drop-shadow(0 0 10px rgba(139, 92, 246, 0.6))'
                  }}
                >
                  <Icon type="trophy" size={48} />
                </div>
              </div>
            </button>

            {/* Карточка Лут боксы */}
            <button
              onClick={() => handleTabChange('lootboxes')}
              disabled
              className="w-full relative overflow-hidden rounded-3xl p-6 md:p-8 transition-all duration-300 opacity-60 cursor-not-allowed group h-32 flex items-center"
              style={{
                background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(234, 88, 12, 0.1) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(251, 146, 60, 0.3)',
                boxShadow: '0 0 20px rgba(251, 146, 60, 0.2), inset 0 0 20px rgba(251, 146, 60, 0.05)'
              }}
            >
              {/* Holographic shimmer effect для лут боксов */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(255, 165, 0, 0.2) 25%, rgba(234, 88, 12, 0.15) 50%, rgba(255, 165, 0, 0.2) 75%, rgba(251, 146, 60, 0.15) 100%)',
                backgroundSize: '200% 200%',
                animation: 'holographic-shimmer 4s ease-in-out infinite'
              }}></div>
              
              <div className="flex items-center justify-between w-full relative z-10">
                <div className="flex-1">
                  <h2
                    className="text-3xl md:text-4xl font-tech font-bold"
                    style={{
                      color: '#e8f4f8',
                      textShadow: '0 0 10px rgba(251, 146, 60, 0.4)'
                    }}
                  >
                    {t('collections.tabs.lootboxes')}
                  </h2>
                  <p
                    className="text-sm md:text-base font-tech mt-1"
                    style={{
                      color: 'rgba(220, 235, 245, 0.7)'
                    }}
                  >
                    {t('collections.lootboxes.comingSoon')}
                  </p>
                </div>
                <div
                  className="flex-shrink-0"
                  style={{
                    color: 'rgba(251, 146, 60, 1)',
                    filter: 'drop-shadow(0 0 8px rgba(251, 146, 60, 0.5))'
                  }}
                >
                  <Icon type="gift" size={48} />
                </div>
              </div>
            </button>

            {/* Карточка Инвентарь */}
            <button
              onClick={() => handleTabChange('inventory')}
              disabled
              className="w-full relative overflow-hidden rounded-3xl p-6 md:p-8 transition-all duration-300 opacity-60 cursor-not-allowed group h-32 flex items-center"
              style={{
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(219, 39, 119, 0.1) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(236, 72, 153, 0.3)',
                boxShadow: '0 0 20px rgba(236, 72, 153, 0.2), inset 0 0 20px rgba(236, 72, 153, 0.05)'
              }}
            >
              {/* Holographic shimmer effect для инвентаря */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{
                background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(219, 39, 119, 0.2) 25%, rgba(168, 85, 247, 0.15) 50%, rgba(219, 39, 119, 0.2) 75%, rgba(236, 72, 153, 0.15) 100%)',
                backgroundSize: '200% 200%',
                animation: 'holographic-shimmer 4s ease-in-out infinite'
              }}></div>
              
              <div className="flex items-center justify-between w-full relative z-10">
                <div className="flex-1">
                  <h2
                    className="text-3xl md:text-4xl font-tech font-bold"
                    style={{
                      color: '#e8f4f8',
                      textShadow: '0 0 10px rgba(236, 72, 153, 0.4)'
                    }}
                  >
                    {t('collections.tabs.inventory')}
                  </h2>
                  <p
                    className="text-sm md:text-base font-tech mt-1"
                    style={{
                      color: 'rgba(220, 235, 245, 0.7)'
                    }}
                  >
                    {t('collections.inventory.comingSoon')}
                  </p>
                </div>
                <div
                  className="flex-shrink-0"
                  style={{
                    color: 'rgba(236, 72, 153, 1)',
                    filter: 'drop-shadow(0 0 8px rgba(236, 72, 153, 0.5))'
                  }}
                >
                  <Icon type="bag" size={48} />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Страница лидерборда
  if (tabMode === 'leaderboard') {
    return (
      <div
        className={cn(
          "fixed inset-0 overflow-y-auto overflow-x-hidden",
          contentLoaded ? 'tab-content-enter-active' : ''
        )}
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #0a0e1a 50%, #0d1220 100%)',
          boxSizing: 'border-box',
          opacity: contentLoaded ? 1 : 0,
          transform: contentLoaded ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.3s ease-out, transform 0.3s ease-out',
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

        <div className="relative z-10 min-h-screen pt-16 md:pt-20 px-4 md:px-6 pb-24">
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
                  {t('collections.leaderboard.title')}
                </h1>

                <p
                  className="mb-6 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto px-4"
                  style={{
                    color: 'rgba(220, 235, 245, 0.7)'
                  }}
                >
                  {t('collections.leaderboard.subtitle')}
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
            </div>

            <LeaderboardView
              isAuthenticated={isAuthenticated}
              leaderboardType={leaderboardType}
              onTypeChange={setLeaderboardType}
              onUserClick={(userId) => {
                setViewedUserId(userId);
                setTabMode('userProfile');
                setContentLoaded(false);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Профиль пользователя
  if (tabMode === 'userProfile' && viewedUserId) {
    return (
      <UserProfileView
        userId={viewedUserId}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  // Заглушки для других функционалов
  return (
    <div className="text-center py-12">
      <div className="mx-auto mb-4" style={{ color: 'rgba(220, 235, 245, 0.5)' }}>
        <Icon type={tabMode === 'lootboxes' ? 'gift' : 'bag'} size={64} />
      </div>
      <h3
        className="text-xl font-tech font-semibold mb-2"
        style={{
          color: '#e8f4f8',
          textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
        }}
      >
        {t(`collections.${tabMode}.comingSoon`)}
      </h3>
      <p
        className="text-sm"
        style={{
          color: 'rgba(220, 235, 245, 0.7)'
        }}
      >
        {t(`collections.${tabMode}.description`)}
      </p>
    </div>
  );
};

export default CollectionsTab;

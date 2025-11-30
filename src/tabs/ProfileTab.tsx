import React, {useState, useEffect, useMemo} from 'react';
import {api} from '../services';
import {useSettings} from '../hooks/useSettings';
import {useLocalization} from '../hooks/useLocalization';
import type {User} from '../api';
import SettingsDialog from '../components/SettingsDialog';
import Icon from '../components/Icon';
import {Card, CardContent, CardHeader} from '../components/ui/card';
import {Avatar, AvatarImage, AvatarFallback} from '../components/ui/avatar';
import {Badge} from '../components/ui/badge';
import {Skeleton} from '../components/ui/skeleton';
import {ExperienceProgressBar} from '../components/ui/experience-progress-bar';

type ProfileTabProps = {
  isAuthenticated: boolean;
};

const ProfileTab: React.FC<ProfileTabProps> = ({isAuthenticated}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [contentLoaded, setContentLoaded] = useState(false);
  const {isLoaded} = useSettings();
  const {t} = useLocalization();

  // Загружаем данные пользователя только при монтировании компонента и если авторизованы
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      setContentLoaded(false);
      api.getUser()
          .then((userData: User) => {
            setUser(userData);
            setLoading(false);
            // Запускаем анимацию появления контента
            setTimeout(() => {
              setContentLoaded(true);
            }, 50);
          })
          .catch((error: any) => {
            console.error('Error getting user:', error);
            setLoading(false);
            setTimeout(() => {
              setContentLoaded(true);
            }, 50);
          });
    }
  }, [isAuthenticated]);

  // Мемоизируем вычисления для оптимизации (до раннего возврата!)
  const level = useMemo(() => user?.player?.level?.level || 1, [user?.player?.level?.level]);
  const currentExp = useMemo(() => user?.player?.level?.currentExperience || 0, [user?.player?.level?.currentExperience]);
  const maxExp = useMemo(() => user?.player?.level?.experienceToNextLevel || 100, [user?.player?.level?.experienceToNextLevel]);
  useMemo(() => {
    if (!currentExp || !maxExp) return 0;
    return Math.min(100, Math.round((currentExp / maxExp) * 100));
  }, [currentExp, maxExp]);
  const assessment = useMemo(() => user?.player?.level?.assessment || 'F', [user?.player?.level?.assessment]);

  // Получаем характеристики из полей сущности Player
  const strength = useMemo(() => user?.player?.strength || 0, [user?.player?.strength]);
  const agility = useMemo(() => user?.player?.agility || 0, [user?.player?.agility]);
  const intelligence = useMemo(() => user?.player?.intelligence || 0, [user?.player?.intelligence]);

  const getAssessmentColor = (assessment: string) => {
    const colorMap: Record<string, { bg: string; border: string; text: string }> = {
      'S': {
        bg: 'rgba(220, 38, 38, 0.15)',
        border: 'rgba(220, 38, 38, 0.4)',
        text: '#e8f4f8'
      },
      'A': {
        bg: 'rgba(249, 115, 22, 0.15)',
        border: 'rgba(249, 115, 22, 0.4)',
        text: '#e8f4f8'
      },
      'B': {
        bg: 'rgba(234, 179, 8, 0.15)',
        border: 'rgba(234, 179, 8, 0.4)',
        text: '#e8f4f8'
      },
      'C': {
        bg: 'rgba(34, 197, 94, 0.15)',
        border: 'rgba(34, 197, 94, 0.4)',
        text: '#e8f4f8'
      },
      'D': {
        bg: 'rgba(59, 130, 246, 0.15)',
        border: 'rgba(59, 130, 246, 0.4)',
        text: '#e8f4f8'
      },
      'E': {
        bg: 'rgba(148, 163, 184, 0.15)',
        border: 'rgba(148, 163, 184, 0.4)',
        text: '#e8f4f8'
      }
    };
    return colorMap[assessment] || colorMap['E'];
  };

  const assessmentStyle = useMemo(() => getAssessmentColor(assessment), [assessment]);

  if (loading || !user || !isLoaded) {
    return <ProfileSkeleton/>;
  }

  return (
      <>
        <style>{`
        .profile-icon-wrapper svg {
          color: inherit;
          fill: none;
          stroke: currentColor;
        }
      `}</style>
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
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15"
               style={{
                 background: 'rgba(180, 216, 232, 0.8)'
               }}></div>
          <div
              className="absolute bottom-1/3 right-1/3 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-10"
              style={{
                background: 'rgba(200, 230, 245, 0.6)'
              }}></div>

          {/* Content container */}
          <div className="relative z-10 min-h-screen pt-16 md:pt-20 px-4 md:px-6 pb-24">
            <div className="max-w-2xl mx-auto space-y-6">

              {/* Profile Card */}
              <Card
                  className="border-0 shadow-none bg-transparent relative"
                  style={{
                    background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
                    backdropFilter: 'blur(20px)',
                    border: '2px solid rgba(220, 235, 245, 0.2)',
                    borderRadius: '24px',
                    boxShadow: `
                  0 0 20px rgba(180, 220, 240, 0.15),
                  inset 0 0 20px rgba(200, 230, 245, 0.03)
                `
                  }}
              >
                {/* Settings Button - Integrated into card top right */}
                <button
                    onClick={() => setShowSettings(true)}
                    className="group absolute top-4 right-4 transition-all duration-300 hover:scale-110 active:scale-95 z-20"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      boxShadow: 'none',
                      padding: 0
                    }}
                    title={t('profile.settings.title')}
                >
                  <div
                      className="profile-icon-wrapper transition-all duration-300 group-hover:rotate-90"
                      style={{
                        color: 'rgba(220, 235, 245, 0.8)',
                        filter: 'drop-shadow(0 0 4px rgba(180, 220, 240, 0.3))'
                      }}
                  >
                    <Icon type="settings" size={24}/>
                  </div>
                </button>
                <CardHeader className="pb-6">
                  {/* Avatar, Level, and Class section - Horizontal layout */}
                  <div
                      className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-6">
                    {/* Avatar with Level badge */}
                    <div className="relative flex-shrink-0">
                      {/* Glow effect */}
                      <div
                          className="absolute inset-0 rounded-full blur-xl opacity-50"
                          style={{
                            background: 'radial-gradient(circle, rgba(180, 220, 240, 0.4) 0%, transparent 70%)'
                          }}
                      ></div>

                      <Avatar className="relative w-24 h-24 md:w-28 md:h-28 border-2" style={{
                        borderColor: 'rgba(220, 235, 245, 0.3)',
                        boxShadow: '0 0 20px rgba(180, 220, 240, 0.3)'
                      }}>
                        <AvatarImage src={user.photoUrl || ''} alt="avatar"/>
                        <AvatarFallback className="font-tech text-xl" style={{
                          background: 'rgba(10, 14, 39, 0.8)',
                          color: '#e8f4f8'
                        }}>
                          {(user.firstName?.[0] || '') + (user.lastName?.[0] || '')}
                        </AvatarFallback>
                      </Avatar>

                      {/* Level badge - positioned at top right, adaptive size */}
                      <div
                          className="absolute -top-2 -right-2 md:-top-3 md:-right-3 rounded-full flex items-center justify-center font-tech font-bold shadow-lg border-2"
                          style={{
                            background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(5, 8, 18, 0.95) 100%)',
                            borderColor: 'rgba(220, 235, 245, 0.4)',
                            color: '#e8f4f8',
                            boxShadow: '0 0 15px rgba(180, 220, 240, 0.4)',
                            minWidth: level >= 100 ? '3rem' : level >= 10 ? '2.75rem' : '2.5rem',
                            minHeight: level >= 100 ? '3rem' : level >= 10 ? '2.75rem' : '2.5rem',
                            width: level >= 100 ? '3rem' : level >= 10 ? '2.75rem' : '2.5rem',
                            height: level >= 100 ? '3rem' : level >= 10 ? '2.75rem' : '2.5rem',
                            fontSize: level >= 100 ? '0.85rem' : level >= 10 ? '0.9rem' : '0.95rem',
                            padding: '0.35rem'
                          }}
                      >
                        {level}
                      </div>
                    </div>

                    {/* Name, Username, and Class */}
                    <div className="flex-1 text-center md:text-left">
                      {/* Name */}
                      <h2
                          className="text-xl md:text-2xl font-tech font-bold mb-1"
                          style={{
                            color: '#e8f4f8',
                            textShadow: '0 0 8px rgba(180, 220, 240, 0.3), 0 0 15px rgba(160, 210, 235, 0.15)'
                          }}
                      >
                        {user.firstName || ''} {user.lastName || ''}
                      </h2>

                      {/* Username */}
                      <p
                          className="text-xs md:text-sm font-tech mb-3"
                          style={{
                            color: 'rgba(220, 235, 245, 0.7)'
                          }}
                      >
                        @{user.username || ''}
                      </p>

                      {/* Assessment badge */}
                      <Badge
                          className="px-3 py-1.5 text-xs md:text-sm font-tech font-bold border-2 rounded-full inline-block"
                          style={{
                            background: assessmentStyle.bg,
                            borderColor: assessmentStyle.border,
                            color: assessmentStyle.text,
                            boxShadow: `0 0 15px ${assessmentStyle.border}40`
                          }}
                      >
                        {t('profile.stats.class')} {assessment}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Experience bar */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                    <span
                        className="text-xs md:text-sm font-tech"
                        style={{color: 'rgba(220, 235, 245, 0.7)'}}
                    >
                      {t('profile.stats.progress')}
                    </span>
                      <span
                          className="text-xs md:text-sm font-tech font-bold"
                          style={{color: '#e8f4f8'}}
                      >
                      {currentExp} / {maxExp} XP
                    </span>
                    </div>
                    <ExperienceProgressBar
                        currentExp={currentExp}
                        maxExp={maxExp}
                        accentColor="rgba(180, 220, 240, 0.8)"
                        height="h-2.5 md:h-3.5"
                        showPulseGlow={true}
                        className="shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]"
                    />
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-3 md:gap-4">
                    {/* Strength */}
                    <Card
                        className="border-0 shadow-none bg-transparent text-center p-4 transition-all duration-300 hover:scale-105"
                        style={{
                          background: 'linear-gradient(135deg, rgba(220, 38, 38, 0.1) 0%, rgba(185, 28, 28, 0.05) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(220, 38, 38, 0.2)',
                          boxShadow: '0 0 15px rgba(220, 38, 38, 0.1)'
                        }}
                    >
                      <div className="flex justify-center items-center mb-2">
                        <div
                            className="profile-icon-wrapper"
                            style={{
                              color: '#e8f4f8',
                              filter: 'drop-shadow(0 0 8px rgba(220, 38, 38, 0.6))'
                            }}
                        >
                          <Icon type="dumbbell" size={28}/>
                        </div>
                      </div>
                      <div
                          className="text-xl md:text-2xl font-tech font-bold mb-1"
                          style={{
                            color: '#e8f4f8',
                            textShadow: '0 0 8px rgba(220, 38, 38, 0.4)'
                          }}
                      >
                        {strength}
                      </div>
                      <div
                          className="text-[10px] md:text-xs font-tech"
                          style={{color: 'rgba(220, 235, 245, 0.7)'}}
                      >
                        {t('profile.stats.strength')}
                      </div>
                    </Card>

                    {/* Agility */}
                    <Card
                        className="border-0 shadow-none bg-transparent text-center p-4 transition-all duration-300 hover:scale-105"
                        style={{
                          background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(22, 163, 74, 0.05) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(34, 197, 94, 0.2)',
                          boxShadow: '0 0 15px rgba(34, 197, 94, 0.1)'
                        }}
                    >
                      <div className="flex justify-center items-center mb-2">
                        <div
                            className="profile-icon-wrapper"
                            style={{
                              color: '#e8f4f8',
                              filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))'
                            }}
                        >
                          <Icon type="zap" size={28}/>
                        </div>
                      </div>
                      <div
                          className="text-xl md:text-2xl font-tech font-bold mb-1"
                          style={{
                            color: '#e8f4f8',
                            textShadow: '0 0 8px rgba(34, 197, 94, 0.4)'
                          }}
                      >
                        {agility}
                      </div>
                      <div
                          className="text-[10px] md:text-xs font-tech"
                          style={{color: 'rgba(220, 235, 245, 0.7)'}}
                      >
                        {t('profile.stats.agility')}
                      </div>
                    </Card>

                    {/* Intelligence */}
                    <Card
                        className="border-0 shadow-none bg-transparent text-center p-4 transition-all duration-300 hover:scale-105 flex flex-col items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)',
                          backdropFilter: 'blur(10px)',
                          border: '1px solid rgba(168, 85, 247, 0.2)',
                          boxShadow: '0 0 15px rgba(168, 85, 247, 0.1)'
                        }}
                    >
                      <div className="flex justify-center items-center mb-2">
                        <div
                            className="profile-icon-wrapper"
                            style={{
                              color: '#e8f4f8',
                              filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.6))'
                            }}
                        >
                          <Icon type="brain" size={28}/>
                        </div>
                      </div>
                      <div
                          className="text-xl md:text-2xl font-tech font-bold mb-1"
                          style={{
                            color: '#e8f4f8',
                            textShadow: '0 0 8px rgba(168, 85, 247, 0.4)'
                          }}
                      >
                        {intelligence}
                      </div>
                      <div
                          className="text-[10px] md:text-xs font-tech text-center"
                          style={{color: 'rgba(220, 235, 245, 0.7)'}}
                      >
                        {t('profile.stats.intelligence')}
                      </div>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Settings Dialog */}
        <SettingsDialog
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
        />

        <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }
      `}</style>
      </>
  );
};

export const ProfileSkeleton: React.FC = () => (
    <div
        className="fixed inset-0 overflow-y-auto overflow-x-hidden"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #0a0e1a 50%, #0d1220 100%)',
          boxSizing: 'border-box'
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
      <div
          className="absolute bottom-1/3 right-1/3 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-10"
          style={{
            background: 'rgba(200, 230, 245, 0.6)'
          }}></div>

      <div className="relative z-10 min-h-screen pt-16 md:pt-20 px-4 md:px-6 pb-24">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Card skeleton */}
          <Card
              className="border-0 shadow-none bg-transparent relative"
              style={{
                background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(220, 235, 245, 0.2)',
                borderRadius: '24px'
              }}
          >
            {/* Settings Button skeleton */}
            <div className="absolute top-4 right-4">
              <Skeleton className="w-6 h-6 rounded" style={{
                background: 'rgba(220, 235, 245, 0.1)'
              }}/>
            </div>
            <CardHeader className="pb-6">
              <div
                  className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-6 mb-6">
                <div className="relative flex-shrink-0">
                  <Skeleton className="w-24 h-24 md:w-28 md:h-28 rounded-full" style={{
                    background: 'rgba(220, 235, 245, 0.1)'
                  }}/>
                  <Skeleton
                      className="absolute -top-2 -right-2 w-8 h-8 md:w-10 md:h-10 rounded-full"
                      style={{
                        background: 'rgba(220, 235, 245, 0.1)'
                      }}/>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <Skeleton className="h-6 md:h-7 w-40 md:w-48 mx-auto md:mx-0 mb-2" style={{
                    background: 'rgba(220, 235, 245, 0.1)'
                  }}/>
                  <Skeleton className="h-4 w-32 mx-auto md:mx-0 mb-3" style={{
                    background: 'rgba(220, 235, 245, 0.1)'
                  }}/>
                  <Skeleton className="h-7 w-20 mx-auto md:mx-0 rounded-full" style={{
                    background: 'rgba(220, 235, 245, 0.1)'
                  }}/>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <Skeleton className="h-4 w-16" style={{
                    background: 'rgba(220, 235, 245, 0.1)'
                  }}/>
                  <Skeleton className="h-4 w-20" style={{
                    background: 'rgba(220, 235, 245, 0.1)'
                  }}/>
                </div>
                <Skeleton className="w-full h-2 md:h-3 rounded-full" style={{
                  background: 'rgba(220, 235, 245, 0.1)'
                }}/>
              </div>

              <div className="grid grid-cols-3 gap-3 md:gap-4">
                {[1, 2, 3].map((i) => (
                    <Card
                        key={i}
                        className="border-0 shadow-none bg-transparent p-4"
                        style={{
                          background: 'rgba(220, 235, 245, 0.05)',
                          border: '1px solid rgba(220, 235, 245, 0.1)'
                        }}
                    >
                      <Skeleton className="w-7 h-7 mx-auto mb-2 rounded" style={{
                        background: 'rgba(220, 235, 245, 0.1)'
                      }}/>
                      <Skeleton className="h-6 w-8 mx-auto mb-1" style={{
                        background: 'rgba(220, 235, 245, 0.1)'
                      }}/>
                      <Skeleton className="h-3 w-12 mx-auto" style={{
                        background: 'rgba(220, 235, 245, 0.1)'
                      }}/>
                    </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
);

export default ProfileTab;

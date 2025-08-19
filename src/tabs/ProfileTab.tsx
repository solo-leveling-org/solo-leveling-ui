import React, { useState, useEffect } from 'react';
import { api } from '../services';
import { useSettings } from '../hooks/useSettings';
import { useLocalization } from '../hooks/useLocalization';
import type { User } from '../api';
import { TelegramIcon } from '../components/TelegramWidget';

type ProfileTabProps = {
  isAuthenticated: boolean;
};

const ProfileTab: React.FC<ProfileTabProps> = ({ isAuthenticated }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'level' | 'balance' | 'settings'>('level');
  const { settings, isLoaded, setLanguage, setLanguageSource } = useSettings();
  const { t } = useLocalization();

  // Загружаем данные пользователя только при монтировании компонента и если авторизованы
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      api.getUser()
        .then((userData: User) => {
          setUser(userData);
          setLoading(false);
        })
        .catch((error: any) => {
          console.error('Error getting user:', error);
          setLoading(false);
        });
    }
  }, [isAuthenticated]);

  if (loading || !user || !isLoaded) {
    return <ProfileSkeleton />;
  }

  const level = user.player?.level?.level || 1;
  const currentExp = user.player?.level?.currentExperience || 0;
  const maxExp = user.player?.level?.experienceToNextLevel || 100;
  const expPercentage = Math.min(100, Math.round((currentExp / maxExp) * 100));
  const assessment = user.player?.level?.assessment || 'F';

  // Получаем характеристики из полей сущности Player
  const strength = user.player?.strength || 0;
  const agility = user.player?.agility || 0;
  const intelligence = user.player?.intelligence || 0;

  const getAssessmentColor = (assessment: string) => {
    const colorMap: Record<string, string> = {
      'S': 'from-red-500 to-red-600',        // Красный - высший уровень
      'A': 'from-orange-500 to-orange-600',  // Оранжевый
      'B': 'from-yellow-500 to-yellow-600',  // Желтый
      'C': 'from-green-500 to-green-600',    // Зеленый
      'D': 'from-blue-500 to-blue-600',      // Синий
      'E': 'from-slate-500 to-slate-600'     // Серый - низший уровень
    };
    return colorMap[assessment] || colorMap['E'];
  };

  const assessmentColor = getAssessmentColor(assessment);

  return (
    <>
      <div className="relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-3xl -z-10 transform scale-105"></div>

        {/* Main card */}
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md mx-auto mt-8 overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-2xl -translate-y-8 translate-x-8"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/30 to-orange-400/30 rounded-full blur-xl translate-y-4 -translate-x-4"></div>

          {/* Profile content */}
          <div className="relative z-10">
            {/* Avatar section */}
            <div className="text-center mb-6">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse blur-sm scale-110"></div>
                <img
                    src={user.photoUrl || ''}
                    alt="avatar"
                    className="relative w-28 h-28 rounded-full object-cover shadow-xl border-4 border-white/50 backdrop-blur-sm transition-transform duration-300 hover:scale-105"
                />
                {/* Level badge */}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-slate-500 to-slate-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold shadow-lg border-2 border-white">
                  {level}
                </div>
              </div>

              <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-1">
                {user.firstName || ''} {user.lastName || ''}
              </h2>
              <p className="text-slate-500 text-lg font-medium mb-2">@{user.username || ''}</p>

              {/* Assessment badge */}
              <div className={`inline-flex items-center bg-gradient-to-r ${assessmentColor} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
                {t('profile.stats.class')} {assessment}
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex space-x-1 mb-6 bg-gray-100/50 backdrop-blur-sm rounded-2xl p-1">
              <button
                onClick={() => setActiveTab('level')}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'level'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                {t('profile.tabs.level')}
              </button>
              <button
                onClick={() => setActiveTab('balance')}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'balance'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                {t('profile.tabs.balance')}
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex-1 py-2 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'settings'
                    ? 'bg-white text-blue-600 shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                }`}
              >
                {t('profile.tabs.settings')}
              </button>
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px]">
              {/* Level Tab */}
              {activeTab === 'level' && (
                <div className="space-y-6">
                  {/* Experience bar */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-600">{t('profile.stats.progress')}</span>
                      <span className="text-sm font-bold text-gray-800">{currentExp} / {maxExp} XP</span>
                    </div>
                    <div className="relative w-full bg-slate-200/50 rounded-full h-3 overflow-hidden backdrop-blur-sm">
                      <div
                          className="absolute top-0 left-0 h-full bg-gradient-to-r from-slate-500 to-slate-600 rounded-full transition-all duration-1000 ease-out shadow-lg"
                          style={{ width: `${expPercentage}%` }}
                      >
                        <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse"></div>
                      </div>
                    </div>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-red-50 to-red-100/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-red-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="text-2xl mb-2">💪</div>
                      <div className="text-xl font-bold text-red-600 mb-1">{strength}</div>
                      <div className="text-xs text-red-500 font-medium">{t('profile.stats.strength')}</div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-green-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="text-2xl mb-2">⚡</div>
                      <div className="text-xl font-bold text-green-600 mb-1">{agility}</div>
                      <div className="text-xs text-green-500 font-medium">{t('profile.stats.agility')}</div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-purple-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <div className="text-2xl mb-2">🧠</div>
                      <div className="text-xl font-bold text-purple-600 mb-1">{intelligence}</div>
                      <div className="text-xs text-purple-500 font-medium">{t('profile.stats.intelligence')}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Balance Tab */}
              {activeTab === 'balance' && (
                <div className="space-y-6">
                  {/* Current Balance */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/30 text-center">
                    <div className="text-2xl mb-3">💰</div>
                    <div className="text-3xl font-bold text-amber-700 mb-2">
                      {user.player?.balance?.balance?.amount || 0}
                    </div>
                    <div className="text-sm text-amber-600 font-medium">
                      {user.player?.balance?.balance?.currencyCode || 'GCO'}
                    </div>
                  </div>

                  {/* Recent Transactions */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4">{t('profile.balance.recentTransactions')}</h3>
                    <div className="space-y-3">
                      {/* Mock transactions */}
                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-sm">+</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">{t('profile.balance.taskCompletion')}</div>
                              <div className="text-xs text-gray-500">{t('profile.balance.today')}, 14:30</div>
                            </div>
                          </div>
                          <div className="text-sm font-bold text-green-600">+50 GCO</div>
                        </div>
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                              <span className="text-red-600 text-sm">-</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">{t('profile.balance.itemPurchase')}</div>
                              <div className="text-xs text-gray-500">{t('profile.balance.yesterday')}, 18:15</div>
                            </div>
                          </div>
                          <div className="text-sm font-bold text-red-600">-25 GCO</div>
                        </div>
                      </div>

                      <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3 border border-white/30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 text-sm">+</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-800">{t('profile.balance.levelBonus')}</div>
                              <div className="text-xs text-gray-500">2 {t('profile.balance.daysAgo')}</div>
                            </div>
                          </div>
                          <div className="text-sm font-bold text-green-600">+100 GCO</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  {/* Language Source Setting */}
                  <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="text-2xl mr-3">🌍</div>
                        <div>
                          <div className="font-bold text-gray-800 text-base">{t('profile.settings.language.sourceTitle')}</div>
                          <div className="text-sm text-slate-500">{t('profile.settings.language.sourceDescription')}</div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <button
                        onClick={() => setLanguageSource('telegram')}
                        className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                          settings.languageSource === 'telegram'
                            ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-lg'
                            : 'border-gray-200 bg-white/50 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-2">
                            <TelegramIcon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div className={`font-semibold text-sm ${
                            settings.languageSource === 'telegram' ? 'text-blue-700' : 'text-gray-600'
                          }`}>
                            {t('profile.settings.language.useTelegram')}
                          </div>
                        </div>
                        {settings.languageSource === 'telegram' && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </button>

                      <button
                        onClick={() => setLanguageSource('manual')}
                        className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                          settings.languageSource === 'manual'
                            ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-emerald-100/50 shadow-lg'
                            : 'border-gray-200 bg-white/50 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">🛠️</div>
                          <div className={`font-semibold text-sm ${
                            settings.languageSource === 'manual' ? 'text-emerald-700' : 'text-gray-600'
                          }`}>
                            {t('profile.settings.language.chooseManually')}
                          </div>
                        </div>
                        {settings.languageSource === 'manual' && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-500 rounded-full"></div>
                        )}
                      </button>
                    </div>

                    {/* Manual language selection (enabled only when manual source) */}
                    <div className={`grid grid-cols-2 gap-3 ${settings.languageSource !== 'manual' ? 'opacity-50 pointer-events-none' : ''}`}>
                      <button
                        onClick={() => setLanguage('ru')}
                        className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                          settings.language === 'ru'
                            ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100/50 shadow-lg'
                            : 'border-gray-200 bg-white/50 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">🇷🇺</div>
                          <div className={`font-semibold text-sm ${
                            settings.language === 'ru' ? 'text-green-700' : 'text-gray-600'
                          }`}>
                            {t('profile.settings.language.russian')}
                          </div>
                        </div>
                        {settings.language === 'ru' && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </button>

                      <button
                        onClick={() => setLanguage('en')}
                        className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                          settings.language === 'en'
                            ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100/50 shadow-lg'
                            : 'border-gray-200 bg-white/50 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">🇺🇸</div>
                          <div className={`font-semibold text-sm ${
                            settings.language === 'en' ? 'text-green-700' : 'text-gray-600'
                          }`}>
                            {t('profile.settings.language.english')}
                          </div>
                        </div>
                        {settings.language === 'en' && (
                          <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ProfileSkeleton: React.FC = () => (
  <div className="relative">
    {/* Background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-3xl -z-10 transform scale-105"></div>

    {/* Main card */}
    <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md mx-auto mt-8 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-2xl -translate-y-8 translate-x-8 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/30 to-orange-400/30 rounded-full blur-xl translate-y-4 -translate-x-4 animate-pulse"></div>

      {/* Profile content skeleton */}
      <div className="relative z-10">
        {/* Avatar section skeleton */}
        <div className="text-center mb-6">
          <div className="relative inline-block mb-4">
            <div className="w-28 h-28 rounded-full bg-gray-300 animate-pulse mx-auto"></div>
            <div className="absolute -bottom-2 -right-2 bg-gray-300 rounded-full w-10 h-10 animate-pulse"></div>
          </div>

          <div className="h-7 bg-gray-300 rounded-lg w-48 mx-auto mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-300 rounded-lg w-32 mx-auto mb-2 animate-pulse"></div>
          <div className="h-8 bg-gray-300 rounded-full w-24 mx-auto animate-pulse"></div>
        </div>

        {/* Tabs Navigation skeleton */}
        <div className="flex space-x-1 mb-6 bg-gray-100/50 backdrop-blur-sm rounded-2xl p-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 py-2 px-3 rounded-xl bg-gray-200 animate-pulse"></div>
          ))}
        </div>

        {/* Tab Content skeleton */}
        <div className="min-h-[200px]">
          <div className="space-y-6">
            {/* Experience bar skeleton */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
              </div>
              <div className="w-full bg-gray-300 rounded-full h-3 animate-pulse"></div>
            </div>

            {/* Stats grid skeleton */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200/50 rounded-2xl p-4 text-center animate-pulse">
                  <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-8 mx-auto mb-1"></div>
                  <div className="h-3 bg-gray-300 rounded w-12 mx-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileTab;
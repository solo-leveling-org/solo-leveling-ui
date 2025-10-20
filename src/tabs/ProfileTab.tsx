import React, { useState, useEffect } from 'react';
import { api } from '../services';
import { useSettings } from '../hooks/useSettings';
import { useLocalization } from '../hooks/useLocalization';
import type { User } from '../api';
import SettingsDialog from '../components/SettingsDialog';
import Icon from '../components/Icon';

type ProfileTabProps = {
  isAuthenticated: boolean;
};

const ProfileTab: React.FC<ProfileTabProps> = ({ isAuthenticated }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { isLoaded } = useSettings();
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
      <div className="space-y-3 pb-20">
        {/* Settings Button - Top Right */}
        <div className="flex justify-end -mt-3">
          <button
            onClick={() => setShowSettings(true)}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all duration-300 hover:scale-110 active:scale-95 shadow-lg"
            title={t('profile.settings.title')}
          >
            <Icon type="settings" size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Profile content */}
        <div className="max-w-md mx-auto">
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

              {/* Stats Content */}
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
                    <div className="flex justify-center items-center mb-2">
                      <Icon type="dumbbell" size={32} className="text-red-500" />
                    </div>
                    <div className="text-xl font-bold text-red-600 mb-1">{strength}</div>
                    <div className="text-xs text-red-500 font-medium">{t('profile.stats.strength')}</div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-green-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex justify-center items-center mb-2">
                      <Icon type="zap" size={32} className="text-green-500" />
                    </div>
                    <div className="text-xl font-bold text-green-600 mb-1">{agility}</div>
                    <div className="text-xs text-green-500 font-medium">{t('profile.stats.agility')}</div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-purple-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <div className="flex justify-center items-center mb-2">
                      <Icon type="brain" size={32} className="text-purple-500" />
                    </div>
                    <div className="text-xl font-bold text-purple-600 mb-1">{intelligence}</div>
                    <div className="text-xs text-purple-500 font-medium">{t('profile.stats.intelligence')}</div>
                  </div>
                </div>
              </div>
        </div>
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </>
  );
};

export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-3 pb-20">
    {/* Settings Button skeleton */}
    <div className="flex justify-end -mt-3">
      <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
    </div>

    {/* Profile content skeleton */}
    <div className="max-w-md mx-auto">
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

          {/* Stats Content skeleton */}
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
);

export default ProfileTab;
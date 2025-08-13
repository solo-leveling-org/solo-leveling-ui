import React, { useState, useEffect } from 'react';
import type { User } from '../api';
import { api } from '../services';
import SettingsDialog from '../components/SettingsDialog';
import { useSettings } from '../hooks/useSettings';

type ProfileTabProps = {
  isAuthenticated: boolean;
};

const ProfileTab: React.FC<ProfileTabProps> = ({ isAuthenticated }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { settings, updateMultipleSettings, isLoaded } = useSettings();

  // Загружаем данные пользователя только при монтировании компонента и если авторизованы
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      api.getUser()
        .then((userData) => {
          setUser(userData);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error getting user:', error);
          setLoading(false);
        });
    }
  }, [isAuthenticated]);

  const handleSettingsChange = (newSettings: { theme: 'light' | 'dark'; language: 'ru' | 'en' }) => {
    updateMultipleSettings(newSettings);
  };

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  if (loading || !user || !isLoaded) {
    return <ProfileSkeleton />;
  }

  const level = user.player?.level?.level || 1;
  const currentExp = user.player?.level?.currentExperience || 0;
  const maxExp = user.player?.level?.experienceToNextLevel || 100;
  const expPercentage = Math.min(100, Math.round((currentExp / maxExp) * 100));
  const assessment = user.player?.level?.assessment || 'F';

  // Определяем характеристики на основе assessment
  const getStatValue = (assessment: string) => {
    const statMap: Record<string, number> = {
      'S': 20, 'A': 18, 'B': 15, 'C': 12, 'D': 8
    };
    return statMap[assessment] || 5;
  };

  const getAssessmentColor = (assessment: string) => {
    const colorMap: Record<string, string> = {
      'S': 'text-purple-600',
      'A': 'text-blue-600',
      'B': 'text-green-600',
      'C': 'text-yellow-600',
      'D': 'text-orange-600'
    };
    return colorMap[assessment] || 'text-gray-600';
  };

  return (
    <>
      {/* Profile Header with Settings Button */}
      <div className="relative mb-6">
        {/* Settings Button - Top Right */}
        <button
          onClick={handleOpenSettings}
          className="absolute top-0 right-0 p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all duration-200 group"
          aria-label="Настройки"
        >
          <div className="w-5 h-5 flex items-center justify-center">
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </button>

        {/* Profile Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Профиль игрока</h1>
        <p className="text-slate-600 text-sm">Уровень {level} • Опыт {currentExp}/{maxExp}</p>
      </div>

      {/* Profile Content */}
      <div className="space-y-6">
        {/* Level Progress */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Прогресс уровня</h2>
            <div className={`text-2xl font-bold ${getAssessmentColor(assessment)}`}>
              {assessment}
            </div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Уровень {level}</span>
              <span>{expPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${expPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-800">{getStatValue(assessment)}</div>
              <div className="text-xs text-gray-600">Сила</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">{getStatValue(assessment)}</div>
              <div className="text-xs text-gray-600">Ловкость</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-800">{getStatValue(assessment)}</div>
              <div className="text-xs text-gray-600">Интеллект</div>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Информация</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Имя:</span>
              <span className="font-medium text-gray-800">{user.firstName || 'Не указано'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Фамилия:</span>
              <span className="font-medium text-gray-800">{user.lastName || 'Не указано'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Username:</span>
              <span className="font-medium text-gray-800">@{user.username || 'Не указано'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Макс. задач:</span>
              <span className="font-medium text-gray-800">{user.player?.maxTasks || 0}</span>
            </div>
          </div>
        </div>

        {/* Balance */}
        {user.player?.balance && (
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Баланс</h2>
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6">
                  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#FFD700" stroke="#FFA500" strokeWidth="2"/>
                    <text x="12" y="16" textAnchor="middle" fontSize="12" fill="#B8860B" fontWeight="bold">G</text>
                  </svg>
                </div>
                <span className="text-2xl font-bold text-gray-800">
                  {user.player.balance.balance?.amount || 0}
                </span>
                <span className="text-gray-600 text-sm">
                  {user.player.balance.balance?.currencyCode || 'GCO'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentTheme={settings.theme}
        currentLanguage={settings.language}
        onSettingsChange={handleSettingsChange}
      />
    </>
  );
};

export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    {/* Profile Header Skeleton */}
    <div className="relative mb-6">
      <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-64"></div>
    </div>

    {/* Level Progress Skeleton */}
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-gray-200 rounded w-32"></div>
        <div className="h-8 bg-gray-200 rounded w-8"></div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <div className="h-4 bg-gray-200 rounded w-20"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3"></div>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="text-center">
            <div className="h-6 bg-gray-200 rounded w-8 mx-auto mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-12 mx-auto"></div>
          </div>
        ))}
      </div>
    </div>

    {/* User Info Skeleton */}
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
      <div className="h-6 bg-gray-200 rounded w-24 mb-4"></div>
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    </div>

    {/* Balance Skeleton */}
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
      <div className="h-6 bg-gray-200 rounded w-16 mb-4"></div>
      <div className="flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
          <div className="h-8 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  </div>
);

export default ProfileTab;
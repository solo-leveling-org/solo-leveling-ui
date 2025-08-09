import React, { useState, useEffect } from 'react';
import type { User } from '../../api';
import { api } from '../../services';

type ProfileTabProps = {
  isAuthenticated: boolean;
};

const ProfileTab: React.FC<ProfileTabProps> = ({ isAuthenticated }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

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

  if (loading || !user) {
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

  const statValue = getStatValue(assessment);

  // Определяем цвет уровня на основе assessment
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
                Уровень {assessment}
              </div>
            </div>

            {/* Experience bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Прогресс</span>
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
                <div className="text-xl font-bold text-red-600 mb-1">{statValue}</div>
                <div className="text-xs text-red-500 font-medium">Сила</div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-green-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-2xl mb-2">⚡</div>
                <div className="text-xl font-bold text-green-600 mb-1">{statValue}</div>
                <div className="text-xs text-green-500 font-medium">Ловкость</div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 backdrop-blur-sm rounded-2xl p-4 text-center border border-purple-200/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <div className="text-2xl mb-2">🧠</div>
                <div className="text-xl font-bold text-purple-600 mb-1">{statValue}</div>
                <div className="text-xs text-purple-500 font-medium">Интеллект</div>
              </div>
            </div>

            {/* Achievement section */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm rounded-2xl p-4 border border-amber-200/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">🏆</div>
                  <div>
                    <div className="text-sm font-medium text-amber-700">Выполнено задач</div>
                    <div className="text-lg font-bold text-amber-600">0</div>
                  </div>
                </div>
                <div className="text-amber-500 opacity-50">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export const ProfileSkeleton: React.FC = () => (
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200/30 via-gray-300/30 to-gray-400/30 rounded-3xl blur-3xl -z-10 transform scale-105 animate-pulse"></div>

      {/* Main card */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md mx-auto mt-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gray-300/20 rounded-full blur-2xl -translate-y-8 translate-x-8 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gray-300/20 rounded-full blur-xl translate-y-4 -translate-x-4 animate-pulse"></div>

        {/* Profile content skeleton */}
        <div className="relative z-10">
          {/* Avatar section */}
          <div className="text-center mb-6">
            <div className="relative inline-block mb-4">
              <div className="w-28 h-28 rounded-full bg-gray-300 animate-pulse mx-auto"></div>
              <div className="absolute -bottom-2 -right-2 bg-gray-300 rounded-full w-10 h-10 animate-pulse"></div>
            </div>

            <div className="h-7 bg-gray-300 rounded-lg w-48 mx-auto mb-2 animate-pulse"></div>
            <div className="h-5 bg-gray-300 rounded-lg w-32 mx-auto mb-2 animate-pulse"></div>
            <div className="h-8 bg-gray-300 rounded-full w-24 mx-auto animate-pulse"></div>
          </div>

          {/* Experience bar skeleton */}
          <div className="mb-8">
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

          {/* Achievement section skeleton */}
          <div className="bg-gray-200/50 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gray-300 rounded mr-3 animate-pulse"></div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-1 animate-pulse"></div>
                  <div className="h-5 bg-gray-300 rounded w-8 animate-pulse"></div>
                </div>
              </div>
              <div className="w-8 h-8 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
);

export default ProfileTab;
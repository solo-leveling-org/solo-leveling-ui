import React from 'react';
import { User } from '../../types';

type ProfileTabProps = {
  user: User;
};

const ProfileTab: React.FC<ProfileTabProps> = ({ user }) => (
  <div className="bg-white rounded-2xl shadow-lg p-7 text-center mt-8 max-w-md mx-auto">
    <img
      src={user.photo_url}
      alt="avatar"
      className="w-24 h-24 rounded-full object-cover mx-auto mb-4 shadow-md border-4 border-blue-100"
    />
    <h2 className="text-2xl font-bold mb-1">{user.first_name} {user.second_name}</h2>
    <p className="text-blue-500 text-lg mb-4">@{user.username}</p>
    <div className="flex flex-col gap-2 items-center mb-6">
      <div className="flex gap-3 text-base">
        <span className="bg-blue-50 text-blue-600 rounded-full px-4 py-1 font-semibold">Уровень: {user.level}</span>
        <span className="bg-green-50 text-green-600 rounded-full px-4 py-1 font-semibold">Выполнено задач: {user.completed_tasks}</span>
      </div>
      <div className="w-full max-w-xs bg-gray-100 rounded-full h-4 mt-2 relative">
        <div
          className="bg-gradient-to-r from-blue-400 to-green-400 h-4 rounded-full"
          style={{ width: `${Math.min(100, Math.round((user.experience / user.experience_to_next_level) * 100))}%` }}
        ></div>
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-semibold text-gray-700">
          {user.experience} / {user.experience_to_next_level} XP
        </span>
      </div>
    </div>
    <div className="flex justify-center gap-6 mt-4">
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-blue-700">{user.strength}</span>
        <span className="text-xs text-gray-500 mt-1">Сила</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-green-700">{user.agility}</span>
        <span className="text-xs text-gray-500 mt-1">Ловкость</span>
      </div>
      <div className="flex flex-col items-center">
        <span className="text-lg font-bold text-purple-700">{user.intelligence}</span>
        <span className="text-xs text-gray-500 mt-1">Интеллект</span>
      </div>
    </div>
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-lg p-7 text-center mt-8 max-w-md mx-auto skeleton">
    <div className="mx-auto mb-4 rounded-full bg-gray-200 shimmer-effect" style={{width: '96px', height: '96px'}} />
    <div className="skeleton-title shimmer-effect mx-auto mb-2" style={{width: '60%'}} />
    <div className="skeleton-title shimmer-effect mx-auto mb-4" style={{width: '40%'}} />
    <div className="flex flex-col gap-2 items-center mb-6">
      <div className="flex gap-3 text-base w-full justify-center">
        <span className="skeleton-pill shimmer-effect" />
        <span className="skeleton-pill shimmer-effect" />
      </div>
      <div className="w-full max-w-xs bg-gray-100 rounded-full h-4 mt-2 relative overflow-hidden">
        <div className="shimmer-effect absolute top-0 left-0 h-4 rounded-full" style={{width: '70%', background: '#e9ecf1'}} />
      </div>
    </div>
    <div className="flex justify-center gap-6 mt-4">
      <span className="skeleton-label shimmer-effect" />
      <span className="skeleton-label shimmer-effect" />
      <span className="skeleton-label shimmer-effect" />
    </div>
  </div>
);

export default ProfileTab; 
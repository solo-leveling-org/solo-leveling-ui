import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocalization } from '../hooks/useLocalization';
import Icon from './Icon';

interface BottomBarProps {
  isAuthenticated: boolean;
  isVisible?: boolean;
}

const BottomBar: React.FC<BottomBarProps> = ({ isAuthenticated, isVisible = true }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLocalization();

  const tabs = [
    {
      key: 'profile',
      path: '/profile',
      icon: 'user',
      label: t('navigation.profile')
    },
    {
      key: 'tasks',
      path: '/tasks',
      icon: 'clipboard',
      label: t('navigation.tasks')
    },
    {
      key: 'home',
      path: '/',
      icon: 'home',
      label: '',
      isCenter: true
    },
    {
      key: 'topics',
      path: '/topics',
      icon: 'target',
      label: t('navigation.topics')
    },
    {
      key: 'balance',
      path: '/balance',
      icon: 'coins',
      label: t('navigation.balance')
    }
  ];

  const handleTabClick = (path: string) => {
    navigate(path);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-gray-900 shadow-2xl">
      <div className="flex items-center justify-around py-3 px-4">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const isCenter = tab.isCenter;
          
          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.path)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all duration-200 min-w-0 flex-1 ${
                isActive 
                  ? 'bg-green-500 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
              } ${isCenter ? 'relative' : ''}`}
            >
              <div className={`${isCenter ? 'mb-0' : 'mb-1'} transition-transform duration-200 ${
                isActive ? 'scale-110' : 'scale-100'
              }`}>
                <Icon 
                  type={tab.icon as any} 
                  size={isCenter ? 28 : 24} 
                  className={isActive ? 'text-white' : 'text-gray-400'} 
                />
              </div>
              {!isCenter && (
                <span className={`text-xs font-medium truncate ${
                  isActive ? 'text-white' : 'text-gray-400'
                }`}>
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomBar;

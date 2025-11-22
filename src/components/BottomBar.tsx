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
    <>
      <style>{`
        .bottom-bar-icon svg {
          color: inherit;
          fill: none;
          stroke: currentColor;
        }
      `}</style>
      <div 
        className="fixed bottom-0 left-0 right-0 z-40"
        style={{
          background: 'linear-gradient(135deg, rgba(5, 8, 18, 0.95) 0%, rgba(10, 14, 39, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(220, 235, 245, 0.15)',
          boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(220, 235, 245, 0.1)'
        }}
      >
      {/* Subtle holographic grid overlay */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(200, 230, 245, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 230, 245, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      <div className="relative flex items-center justify-around py-3 px-2 md:px-4">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const isCenter = tab.isCenter;
          
          return (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.path)}
              className={`group relative flex flex-col items-center justify-center py-2 px-2 md:px-3 min-w-0 flex-1 ${
                isCenter ? 'relative' : ''
              }`}
              style={{
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(180, 220, 240, 0.1) 0%, rgba(160, 210, 235, 0.05) 100%)'
                  : 'transparent',
                border: isActive 
                  ? '1px solid rgba(220, 235, 245, 0.3)'
                  : '1px solid transparent',
                borderRadius: '12px',
                boxShadow: isActive
                  ? `0 0 15px rgba(180, 220, 240, 0.2), inset 0 0 10px rgba(200, 230, 245, 0.05)`
                  : 'none',
                transition: 'transform 0.2s ease-out, opacity 0.2s ease-out'
              }}
            >
              {/* Active glow effect */}
              <div 
                className="absolute inset-0 rounded-xl" 
                style={{
                  background: isActive 
                    ? 'radial-gradient(circle at center, rgba(180, 220, 240, 0.2) 0%, transparent 70%)'
                    : 'transparent',
                  filter: 'blur(8px)',
                  opacity: isActive ? 0.5 : 0,
                  transition: 'opacity 0.15s ease-out'
                }}
              ></div>

              <div 
                className={`bottom-bar-icon relative z-10 ${isCenter ? 'mb-0' : 'mb-1'} ${
                  isActive ? 'scale-110' : 'scale-100 group-hover:scale-105'
                }`}
                style={{
                  color: isActive ? '#e8f4f8' : 'rgba(220, 235, 245, 0.6)',
                  filter: isActive 
                    ? 'drop-shadow(0 0 8px rgba(180, 220, 240, 0.4)) drop-shadow(0 0 15px rgba(160, 210, 235, 0.2))'
                    : 'drop-shadow(0 0 4px rgba(200, 230, 245, 0.2))',
                  transition: 'transform 0.2s ease-out, color 0.15s ease-out, filter 0.15s ease-out'
                }}
              >
                <Icon 
                  type={tab.icon as any} 
                  size={isCenter ? 28 : 24} 
                />
              </div>
              {!isCenter && (
                <span 
                  className="relative z-10 text-[10px] md:text-xs font-tech tracking-wider truncate"
                  style={{
                    color: isActive ? '#e8f4f8' : 'rgba(220, 235, 245, 0.6)',
                    textShadow: isActive
                      ? '0 0 6px rgba(180, 220, 240, 0.3), 0 0 12px rgba(160, 210, 235, 0.15)'
                      : '0 0 3px rgba(200, 230, 245, 0.2)',
                    transition: 'color 0.15s ease-out, text-shadow 0.15s ease-out'
                  }}
                >
                  {tab.label}
                </span>
              )}

              {/* Hover effect for inactive tabs */}
              {!isActive && (
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                  background: 'linear-gradient(135deg, rgba(180, 220, 240, 0.05) 0%, rgba(160, 210, 235, 0.02) 100%)',
                  border: '1px solid rgba(220, 235, 245, 0.1)'
                }}></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
    </>
  );
};

export default BottomBar;

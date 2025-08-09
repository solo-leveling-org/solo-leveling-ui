import React from 'react';

export interface RarityIndicatorProps {
  rarity: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

// Определяем цвета для анимированных градиентов редкости
const getRarityColors = (rarity: string): string[] => {
  switch (rarity) {
    case 'COMMON':
      return ['#9CA3AF', '#6B7280', '#4B5563', '#9CA3AF'];
    case 'UNCOMMON':
      return ['#10B981', '#059669', '#047857', '#10B981'];
    case 'RARE':
      return ['#3B82F6', '#1D4ED8', '#1E40AF', '#3B82F6'];
    case 'EPIC':
      return ['#8B5CF6', '#7C3AED', '#6D28D9', '#8B5CF6'];
    case 'LEGENDARY':
      return ['#F59E0B', '#D97706', '#B45309', '#F59E0B'];
    default:
      return ['#9CA3AF', '#6B7280', '#4B5563', '#9CA3AF'];
  }
};

const getRarityLabel = (rarity: string): string => {
  switch (rarity) {
    case 'COMMON':
      return 'Обычная';
    case 'UNCOMMON':
      return 'Необычная';
    case 'RARE':
      return 'Редкая';
    case 'EPIC':
      return 'Эпическая';
    case 'LEGENDARY':
      return 'Легендарная';
    default:
      return 'Обычная';
  }
};

const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
  switch (size) {
    case 'sm':
      return {
        circle: 'w-6 h-6',
        blur: 'blur(3px)',
        text: 'text-xs px-2 py-1'
      };
    case 'lg':
      return {
        circle: 'w-10 h-10',
        blur: 'blur(6px)',
        text: 'text-base px-4 py-2'
      };
    default: // md
      return {
        circle: 'w-8 h-8',
        blur: 'blur(4px)',
        text: 'text-sm px-3 py-1.5'
      };
  }
};

const RarityIndicator: React.FC<RarityIndicatorProps> = ({
  rarity = 'COMMON',
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const colors = getRarityColors(rarity);
  const sizeClasses = getSizeClasses(size);
  const rarityLabel = getRarityLabel(rarity);

  if (showLabel) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {/* Rarity circle */}
        <div className="relative">
          <div 
            className={`${sizeClasses.circle} rounded-full shadow-lg`}
            style={{
              background: `linear-gradient(45deg, ${colors.join(', ')})`,
              backgroundSize: '300% 300%',
              animation: 'rarityShimmerSmooth 3s ease-in-out infinite',
            }}
          ></div>
          
          {/* Outer glow ring */}
          <div 
            className={`absolute inset-0 ${sizeClasses.circle} rounded-full animate-pulse`}
            style={{
              background: `linear-gradient(45deg, ${colors.join(', ')})`,
              filter: sizeClasses.blur,
              opacity: '0.6',
              zIndex: -1,
            }}
          ></div>
        </div>
        
        {/* Rarity text */}
        <span className={`font-bold text-gray-700 bg-white/60 backdrop-blur-sm ${sizeClasses.text} rounded-full border border-white/30`}>
          {rarityLabel}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main circle */}
      <div 
        className={`${sizeClasses.circle} rounded-full shadow-lg`}
        style={{
          background: `linear-gradient(45deg, ${colors.join(', ')})`,
          backgroundSize: '300% 300%',
          animation: 'rarityShimmerSmooth 3s ease-in-out infinite',
        }}
      ></div>
      
      {/* Outer glow ring */}
      <div 
        className={`absolute inset-0 ${sizeClasses.circle} rounded-full animate-pulse`}
        style={{
          background: `linear-gradient(45deg, ${colors.join(', ')})`,
          filter: sizeClasses.blur,
          opacity: '0.6',
          zIndex: -1,
        }}
      ></div>
    </div>
  );
};

export default RarityIndicator;

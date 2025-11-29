import React from 'react';
import { useLocalization } from '../hooks/useLocalization';

export interface RarityIndicatorProps {
  rarity: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

// Определяем цвета для неоновых эффектов редкости
const getRarityColors = (rarity: string): { 
  neon: string; 
  glow: string;
} => {
  switch (rarity) {
    case 'COMMON':
      return {
        neon: 'rgba(180, 220, 240, 0.8)',
        glow: 'rgba(180, 220, 240, 0.5)'
      };
    case 'UNCOMMON':
      return {
        neon: 'rgba(34, 197, 94, 1)',
        glow: 'rgba(34, 197, 94, 0.7)'
      };
    case 'RARE':
      // Более синий оттенок для RARE
      return {
        neon: 'rgba(100, 180, 255, 1)',
        glow: 'rgba(100, 180, 255, 0.8)'
      };
    case 'EPIC':
      return {
        neon: 'rgba(168, 85, 247, 1)',
        glow: 'rgba(168, 85, 247, 0.7)'
      };
    case 'LEGENDARY':
      return {
        neon: 'rgba(234, 179, 8, 1)',
        glow: 'rgba(234, 179, 8, 0.7)'
      };
    default:
      return {
        neon: 'rgba(180, 220, 240, 0.8)',
        glow: 'rgba(180, 220, 240, 0.5)'
      };
  }
};

const getRarityLabel = (rarity: string, t: (k: string) => string): string => {
  const translated = t(`rarity.${rarity}`);
  return translated || rarity;
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
  const { t } = useLocalization();
  const colorScheme = getRarityColors(rarity);
  const sizeClasses = getSizeClasses(size);
  const rarityLabel = getRarityLabel(rarity, t);

  // Определяем количество звезд в зависимости от редкости
  const getStarCount = (rarity: string): number => {
    switch (rarity) {
      case 'COMMON': return 1;
      case 'UNCOMMON': return 2;
      case 'RARE': return 3;
      case 'EPIC': return 4;
      case 'LEGENDARY': return 5;
      default: return 1;
    }
  };

  const starCount = getStarCount(rarity);
  // Увеличиваем размер звезд, чтобы они соответствовали размеру плашки с названием редкости
  const starSize = size === 'sm' ? 20 : size === 'lg' ? 28 : 24;

  if (showLabel) {
    return (
      <div className={`flex items-center space-x-3 ${className}`} style={{ pointerEvents: 'none' }}>
        {/* Звездочки для обозначения редкости */}
        <div className="flex items-center gap-0.5">
          {Array.from({ length: starCount }).map((_, index) => (
            <svg
              key={index}
              width={starSize}
              height={starSize}
              viewBox="0 0 24 24"
              fill="none"
              style={{
                filter: `drop-shadow(0 0 ${size === 'sm' ? '4px' : size === 'lg' ? '6px' : '5px'} ${colorScheme.neon})`,
              }}
            >
              <path
                d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                fill={colorScheme.neon}
                stroke={colorScheme.neon}
                strokeWidth="0.5"
                opacity="0.9"
              />
            </svg>
          ))}
        </div>
        
        {/* Rarity text */}
        <span 
          className={`font-tech font-bold ${sizeClasses.text} rounded-full backdrop-blur-sm border relative`}
          style={{
            color: colorScheme.neon,
            background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.9) 0%, rgba(5, 8, 18, 0.95) 100%)',
            borderColor: colorScheme.neon,
            boxShadow: `0 0 8px ${colorScheme.neon}`,
            textShadow: `0 0 4px ${colorScheme.neon}`,
          }}
        >
          {rarityLabel}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center ${className}`} style={{ pointerEvents: 'none' }}>
      {/* Звездочки для обозначения редкости */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: starCount }).map((_, index) => (
          <svg
            key={index}
            width={starSize}
            height={starSize}
            viewBox="0 0 24 24"
            fill="none"
            style={{
              filter: `drop-shadow(0 0 ${size === 'sm' ? '3px' : size === 'lg' ? '5px' : '4px'} ${colorScheme.neon})`,
            }}
          >
            <path
              d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
              fill={colorScheme.neon}
              stroke={colorScheme.neon}
              strokeWidth="0.5"
              opacity="0.9"
            />
          </svg>
        ))}
      </div>
    </div>
  );
};

export default RarityIndicator;

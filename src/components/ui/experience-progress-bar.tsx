import React from 'react';

interface ExperienceProgressBarProps {
  /** Текущий опыт */
  currentExp: number;
  /** Максимальный опыт для следующего уровня */
  maxExp: number;
  /** Цвет акцента (для градиента и свечения) */
  accentColor?: string;
  /** Высота полосы (по умолчанию 1.5 для топиков, можно переопределить для профиля) */
  height?: string;
  /** Дополнительные классы для контейнера */
  className?: string;
  /** Показывать ли пульсирующий эффект (по умолчанию false, используется в ProfileTab) */
  showPulseGlow?: boolean;
}

/**
 * Переиспользуемый компонент полосы опыта с анимацией shimmer
 * Shimmer эффект всегда проходит по всей ширине контейнера, независимо от текущего опыта
 */
export const ExperienceProgressBar: React.FC<ExperienceProgressBarProps> = ({
  currentExp = 0,
  maxExp = 100,
  accentColor = 'rgba(180, 220, 240, 0.6)',
  height = 'h-1.5',
  className = '',
  showPulseGlow = false,
}) => {
  const expPercentage = Math.min(100, Math.round((currentExp / maxExp) * 100));
  
  // Вычисляем цвет для градиента (немного темнее для конца)
  // Ищем последнее число с плавающей точкой (прозрачность) и уменьшаем его
  const accentColorDarker = accentColor.replace(/rgba?\(([^)]+)\)/, (match, content) => {
    const parts = content.split(',').map((s: string) => s.trim());
    if (parts.length === 4) {
      // rgba
      const alpha = parseFloat(parts[3]);
      return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${(alpha * 0.67).toFixed(2)})`;
    } else if (parts.length === 3) {
      // rgb
      return match; // Если нет альфа-канала, возвращаем как есть
    }
    return match;
  });

  return (
    <div 
      className={`relative w-full rounded-full ${height} overflow-hidden ${className}`}
      style={{
        background: 'rgba(220, 235, 245, 0.1)',
        border: '1px solid rgba(220, 235, 245, 0.2)'
      }}
    >
      {/* Progress fill */}
      <div
        className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
        style={{ 
          width: `${expPercentage}%`,
          background: `linear-gradient(90deg, ${accentColor} 0%, ${accentColorDarker} 100%)`,
          boxShadow: `0 0 8px ${accentColor}`,
          minWidth: expPercentage > 0 ? '4px' : '0px'
        }}
      >
        {/* Pulsing glow effect - только если включен */}
        {showPulseGlow && (
          <div 
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
              animation: 'pulse-glow 3s ease-in-out infinite',
              opacity: 0.3
            }}
          ></div>
        )}
      </div>
      
      {/* Shimmer effect на всю ширину контейнера - всегда показывается, независимо от опыта */}
      <div 
        className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
        style={{
          width: '100%',
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 3s ease-in-out infinite',
          opacity: 0.5
        }}
      ></div>
    </div>
  );
};


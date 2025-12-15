import React, { useState, useMemo, useEffect } from 'react';
import type { Stamina } from '../api';
import Icon from './Icon';
import { useLocalization } from '../hooks/useLocalization';

type StaminaIndicatorProps = {
  stamina: Stamina | null;
  onStaminaUpdate?: (updatedStamina: Stamina) => void;
};

const StaminaIndicator: React.FC<StaminaIndicatorProps> = ({ stamina, onStaminaUpdate }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [localStamina, setLocalStamina] = useState<Stamina | null>(stamina);
  const { t } = useLocalization();

  // Используем локальную стамину для отображения
  const displayStamina = localStamina || stamina;

  // Синхронизируем локальную стамину с пропсом
  useEffect(() => {
    if (stamina) {
      setLocalStamina({ ...stamina });
    }
  }, [stamina]);

  // Обновляем время каждую секунду и проверяем восстановление стамины
  useEffect(() => {
    if (!localStamina) return;
    
    const interval = setInterval(() => {
      setLocalStamina((prevStamina) => {
        if (!prevStamina) return prevStamina;
        
        const now = new Date();
        setCurrentTime(now);
        
        // Локально обновляем стамину если время восстановления подошло
        if (prevStamina.nextRegenAt && prevStamina.current < prevStamina.max) {
          const nextRegen = new Date(prevStamina.nextRegenAt);
          
          if (now >= nextRegen) {
            // Прибавляем стамину локально
            const newCurrent = Math.min(
              prevStamina.current + prevStamina.regenRate,
              prevStamina.max
            );
            
            // Обновляем время следующего восстановления
            let newNextRegenAt: string | undefined;
            let newFullRegenAt: string | undefined;
            
            if (newCurrent < prevStamina.max) {
              newNextRegenAt = new Date(now.getTime() + prevStamina.regenIntervalSeconds * 1000).toISOString();
              const remainingStamina = prevStamina.max - newCurrent;
              newFullRegenAt = new Date(now.getTime() + remainingStamina * prevStamina.regenIntervalSeconds * 1000).toISOString();
            } else {
              // Стамина полностью восстановлена
              newNextRegenAt = undefined;
              newFullRegenAt = undefined;
            }
            
            const updatedStamina = {
              ...prevStamina,
              current: newCurrent,
              nextRegenAt: newNextRegenAt,
              fullRegenAt: newFullRegenAt,
              isRegenerating: newCurrent < prevStamina.max,
            };
            
            // Уведомляем родительский компонент об обновлении стамины
            if (onStaminaUpdate) {
              onStaminaUpdate(updatedStamina);
            }
            
            return updatedStamina;
          }
        }
        
        return prevStamina;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [localStamina, onStaminaUpdate]);

  // Форматирование времени восстановления (хуки должны быть до раннего возврата)
  const formatTimeUntil = useMemo(() => {
    if (!displayStamina?.nextRegenAt) return null;
    
    const nextRegen = new Date(displayStamina.nextRegenAt);
    const diffMs = nextRegen.getTime() - currentTime.getTime();
    
    // Если время уже прошло или равно 0, показываем время до следующего восстановления
    const secondsUntilNext = Math.max(0, Math.ceil(diffMs / 1000));
    
    if (secondsUntilNext === 0) {
      // Если время уже пришло, показываем полный интервал до следующего восстановления
      return `${displayStamina.regenIntervalSeconds} ${t('tasks.stamina.seconds')}`;
    }
    
    const minutes = Math.floor(secondsUntilNext / 60);
    const seconds = secondsUntilNext % 60;
    
    if (minutes > 0) {
      // Если секунды равны 0, показываем только минуты
      if (seconds === 0) {
        return `${minutes} ${t('tasks.stamina.minutes')}`;
      }
      return `${minutes} ${t('tasks.stamina.minutes')} ${seconds} ${t('tasks.stamina.seconds')}`;
    }
    return `${seconds} ${t('tasks.stamina.seconds')}`;
  }, [displayStamina?.nextRegenAt, displayStamina?.regenIntervalSeconds, currentTime, t]);

  const formatFullRegenTime = useMemo(() => {
    if (!displayStamina?.fullRegenAt) return null;
    
    const fullRegen = new Date(displayStamina.fullRegenAt);
    const diffMs = fullRegen.getTime() - currentTime.getTime();
    
    if (diffMs <= 0) return t('tasks.stamina.fullyRestored');
    
    const totalSeconds = Math.floor(diffMs / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    // Если есть часы, показываем только часы и минуты (без секунд)
    if (hours > 0) {
      return `${hours} ${t('tasks.stamina.hours')} ${minutes} ${t('tasks.stamina.minutes')}`;
    }
    
    // Если меньше минуты, показываем секунды
    if (totalSeconds < 60) {
      return `${seconds} ${t('tasks.stamina.seconds')}`;
    }
    
    // Если меньше часа, показываем минуты и секунды (если секунды не равны 0)
    if (seconds === 0) {
      return `${minutes} ${t('tasks.stamina.minutes')}`;
    }
    return `${minutes} ${t('tasks.stamina.minutes')} ${seconds} ${t('tasks.stamina.seconds')}`;
  }, [displayStamina?.fullRegenAt, currentTime, t]);
  
  if (!displayStamina) {
    return null;
  }

  const percentage = (displayStamina.current / displayStamina.max) * 100;
  
  // Приглушенные цвета проекта в стиле Solo Leveling
  const staminaColors = {
    start: 'rgba(180, 220, 240, 0.8)',      // Приглушенный голубой
    middle: 'rgba(200, 230, 245, 0.7)',     // Светлый голубой
    end: 'rgba(180, 220, 240, 0.6)',       // Более темный голубой
    glow: 'rgba(180, 220, 240, 0.3)',
    glowStrong: 'rgba(200, 230, 245, 0.2)',
  };

  return (
    <div
      className="relative rounded-xl px-4 pt-4 pb-3 backdrop-blur-md group"
      style={{
        background: 'rgba(220, 235, 245, 0.08)',
        border: '1px solid rgba(220, 235, 245, 0.12)',
      }}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="flex items-center gap-2">
          <Icon type="zap" size={20} />
          <span
            className="text-sm md:text-base font-tech font-semibold"
            style={{ color: '#e8f4f8' }}
          >
            {t('tasks.stamina.title')}
          </span>
        </div>
        <div className="flex-1"></div>
        <span
          className="text-sm md:text-base font-tech font-bold"
          style={{ color: '#e8f4f8' }}
        >
          {displayStamina.current} / {displayStamina.max}
        </span>
      </div>

      {/* Holographic Progress bar with iridescent animation */}
      <div className="relative mb-3">
        <div
          className="w-full h-4 rounded-full overflow-hidden relative"
          style={{
            background: 'rgba(220, 235, 245, 0.1)',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Animated holographic gradient fill */}
          <div
            className="h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden"
            style={{
              width: `${percentage}%`,
            }}
          >
            {/* Main gradient with enhanced iridescent animation */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${staminaColors.start} 0%, ${staminaColors.middle} 30%, ${staminaColors.end} 60%, ${staminaColors.middle} 85%, ${staminaColors.start} 100%)`,
                backgroundSize: '300% 100%',
                animation: 'holographic-shimmer 4s ease-in-out infinite',
                boxShadow: `
                  inset 0 1px 0 rgba(255, 255, 255, 0.2),
                  0 0 15px ${staminaColors.glow},
                  0 0 30px ${staminaColors.glowStrong}
                `,
              }}
            />
            
            {/* Enhanced shine effect overlay */}
            <div
              className="absolute inset-0 rounded-full opacity-50"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 50%, transparent 100%)',
                animation: 'shimmer 2.5s ease-in-out infinite',
              }}
            />
            
            {/* Additional shimmer layer for more depth */}
            <div
              className="absolute inset-0 rounded-full opacity-30"
              style={{
                background: 'linear-gradient(45deg, transparent 30%, rgba(200, 230, 245, 0.4) 50%, transparent 70%)',
                animation: 'shimmer-reverse 3s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      {/* Next regeneration time - always visible if nextRegenAt exists */}
      {displayStamina.nextRegenAt && formatTimeUntil && (
        <div className="flex items-center justify-between text-xs font-tech mb-0">
          <span style={{ color: 'rgba(220, 235, 245, 0.7)' }}>
            {t('tasks.stamina.nextRegen')}:
          </span>
          <span 
            className="font-bold"
            style={{ 
              color: 'rgba(180, 220, 240, 0.9)',
              textShadow: '0 0 6px rgba(180, 220, 240, 0.4)',
            }}
          >
            {formatTimeUntil}
          </span>
        </div>
      )}

      {/* Tooltip with full regeneration info - appears on hover */}
      {showTooltip && displayStamina.fullRegenAt && formatFullRegenTime && (
        <div
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-4 py-3 rounded-lg backdrop-blur-md z-50 pointer-events-none whitespace-nowrap"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(5, 8, 18, 0.95) 100%)',
            border: '1px solid rgba(180, 220, 240, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(180, 220, 240, 0.2)',
            minWidth: '280px',
          }}
        >
          <div className="space-y-2">
            {displayStamina.fullRegenAt && formatFullRegenTime && (
              <div className="flex items-center justify-between gap-4">
                <span className="text-xs font-tech whitespace-nowrap" style={{ color: 'rgba(220, 235, 245, 0.7)' }}>
                  {t('tasks.stamina.fullRegen')}:
                </span>
                <span className="text-xs font-tech font-bold whitespace-nowrap" style={{ color: 'rgba(180, 220, 240, 0.9)' }}>
                  {formatFullRegenTime}
                </span>
              </div>
            )}
            {displayStamina.isRegenerating && (
              <div className="pt-2 border-t border-white/10">
                <div className="text-xs font-tech whitespace-nowrap text-center" style={{ color: 'rgba(220, 235, 245, 0.6)' }}>
                  +{displayStamina.regenRate} {t('tasks.stamina.every')} {displayStamina.regenIntervalSeconds} {t('tasks.stamina.seconds')}
                </div>
              </div>
            )}
          </div>
          
          {/* Tooltip arrow */}
          <div
            className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px"
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderTop: '6px solid rgba(180, 220, 240, 0.3)',
            }}
          />
        </div>
      )}


      {/* CSS animations */}
      <style>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        
        @keyframes holographic-shimmer {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        @keyframes shimmer-reverse {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </div>
  );
};

export default StaminaIndicator;

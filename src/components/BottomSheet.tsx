import React, { useEffect, useState, useRef } from 'react';
import { useDrag } from '@use-gesture/react';
import { useModal } from '../contexts/ModalContext';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BottomSheet: React.FC<BottomSheetProps> = ({ isOpen, onClose, title, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [dragY, setDragY] = useState(0);
  const sheetRef = useRef<HTMLDivElement>(null);
  const { setIsBottomSheetOpen } = useModal();


  // Анимация открытия
  useEffect(() => {
    if (isOpen) {
      // Сброс позиции при открытии
      setDragY(0);
      // Сразу показываем для анимации
      setIsVisible(true);
      // Блокируем скролл body
      document.body.style.overflow = 'hidden';
      // Уведомляем контекст об открытии
      setIsBottomSheetOpen(true);
    } else {
      setIsVisible(false);
      setDragY(0);
      // Восстанавливаем скролл
      document.body.style.overflow = 'unset';
      // Уведомляем контекст о закрытии
      setIsBottomSheetOpen(false);
    }
  }, [isOpen, setIsBottomSheetOpen]);

  // Закрытие при нажатии Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Используем готовую библиотеку для свайпов
  const bind = useDrag(
    ({ down, movement: [, my], velocity: [, vy], direction: [, dy] }) => {
      if (down) {
        // Во время перетаскивания - только вниз
        if (my > 0) {
          setDragY(my);
        }
      } else {
        // При отпускании
        if (my > 150 || (vy > 0.8 && dy > 0)) {
          // Закрываем если свайпнули достаточно далеко или быстро
          onClose();
        } else {
          // Возвращаем на место с анимацией
          setDragY(0);
        }
      }
    },
    {
      axis: 'y',
      filterTaps: true,
      bounds: { top: 0 },
      // Настройки для лучшей работы на мобильных устройствах
      preventScroll: false,
      preventScrollAxis: undefined,
      // Оптимизации для производительности
      rubberband: false, // Отключаем резиновый эффект для лучшей производительности
      threshold: 10, // Минимальное расстояние для начала drag
      pointer: { capture: false }, // Отключаем capture для лучшей производительности
      touch: { capture: false } // Отключаем capture для touch событий
    }
  );

  if (!isOpen) return null;

  const transformStyle = {
    transform: `translate3d(0, ${dragY}px, 0)`, // Используем translate3d для аппаратного ускорения
    transition: dragY > 0 ? 'none' : 'transform 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    willChange: 'transform' as const, // Подсказка браузеру для оптимизации
    backfaceVisibility: 'hidden' as const, // Улучшает производительность
    perspective: '1000px' // Включает аппаратное ускорение
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transition: 'opacity 0.3s ease-out'
        }}
        onClick={onClose}
      />
      
      {/* Bottom Sheet - Solo Leveling Style */}
      <div 
        ref={sheetRef}
        className={`bottom-sheet fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl md:rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{
          ...transformStyle,
          background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.98) 0%, rgba(5, 8, 18, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(220, 235, 245, 0.2)',
          borderBottom: 'none',
          boxShadow: '0 -4px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(180, 220, 240, 0.2), inset 0 0 20px rgba(200, 230, 245, 0.03)',
          // Анимация всплытия
          transition: dragY > 0 ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease-out',
          // Дополнительные оптимизации для мобильных устройств
          WebkitTransform: `translate3d(0, ${dragY}px, 0)`, // WebKit оптимизация
          WebkitBackfaceVisibility: 'hidden',
          WebkitPerspective: '1000px'
        }}
        {...bind()}
      >
        {/* Glowing orbs */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-2xl opacity-10" style={{
          background: 'rgba(180, 216, 232, 0.8)'
        }}></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 rounded-full blur-xl opacity-10" style={{
          background: 'rgba(200, 230, 245, 0.6)'
        }}></div>

        {/* Handle bar */}
        <div className="relative z-10 flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
          <div 
            className="w-10 h-1 rounded-full"
            style={{
              background: 'rgba(220, 235, 245, 0.4)'
            }}
          ></div>
        </div>
        
        {/* Header */}
        <div 
          className={`relative z-10 px-6 py-4 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} 
          style={{ 
            transition: isVisible ? 'transform 0.3s ease-out 0.1s, opacity 0.3s ease-out 0.1s' : 'transform 0.2s ease-in, opacity 0.2s ease-in',
            borderBottom: '1px solid rgba(220, 235, 245, 0.1)'
          }}
        >
          <div className="flex items-center justify-between">
            <h3 
              className="text-lg font-tech font-semibold select-none"
              style={{
                color: '#e8f4f8',
                textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
              }}
            >
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 select-none"
              style={{
                background: 'rgba(220, 235, 245, 0.1)',
                border: '1px solid rgba(220, 235, 245, 0.2)',
                color: '#e8f4f8'
              }}
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div 
          className={`relative z-10 px-6 py-4 overflow-y-auto max-h-[60vh] ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} 
          style={{ 
            transition: isVisible ? 'transform 0.3s ease-out 0.15s, opacity 0.3s ease-out 0.15s' : 'transform 0.2s ease-in, opacity 0.2s ease-in'
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;

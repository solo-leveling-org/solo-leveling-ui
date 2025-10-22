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
      
      {/* Bottom Sheet */}
      <div 
        ref={sheetRef}
        className={`bottom-sheet fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl max-h-[80vh] overflow-hidden ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
        style={{
          ...transformStyle,
          // Анимация всплытия
          transition: dragY > 0 ? 'none' : 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease-out',
          // Дополнительные оптимизации для мобильных устройств
          WebkitTransform: `translate3d(0, ${dragY}px, 0)`, // WebKit оптимизация
          WebkitBackfaceVisibility: 'hidden',
          WebkitPerspective: '1000px'
        }}
        {...bind()}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-2 cursor-grab active:cursor-grabbing">
          <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className={`px-6 py-4 border-b border-gray-200 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`} style={{ 
          transition: isVisible ? 'transform 0.3s ease-out 0.1s, opacity 0.3s ease-out 0.1s' : 'transform 0.2s ease-in, opacity 0.2s ease-in'
        }}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 select-none">
              {title}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors select-none"
            >
              ✕
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className={`px-6 py-4 overflow-y-auto max-h-[60vh] ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`} style={{ 
          transition: isVisible ? 'transform 0.3s ease-out 0.15s, opacity 0.3s ease-out 0.15s' : 'transform 0.2s ease-in, opacity 0.2s ease-in'
        }}>
          {children}
        </div>
      </div>
    </>
  );
};

export default BottomSheet;

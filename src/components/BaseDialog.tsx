import React, { useEffect, ReactNode, useState } from 'react';
import { createPortal } from 'react-dom';
import { useModal } from '../contexts/ModalContext';
import { useScrollLock } from '../hooks/useScrollLock';

export interface BaseDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  maxWidth?: string;
  maxHeight?: string;
  onClickBackdrop?: () => void;
}

/**
 * Базовый компонент для всех диалоговых окон
 * Обеспечивает единообразный backdrop (затемнение без blur) и управление скроллом
 */
const BaseDialog: React.FC<BaseDialogProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  contentClassName = '',
  maxWidth = 'max-w-md',
  maxHeight = 'max-h-[calc(95vh-env(safe-area-inset-top,0px)-5rem)]',
  onClickBackdrop,
}) => {
  const { openDialog, closeDialog } = useModal();
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Определяем размер экрана
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Управление модальным контекстом и блокировкой скролла
  useEffect(() => {
    if (isOpen) {
      openDialog();
      setIsVisible(false); // Сбрасываем видимость перед анимацией
      // Запускаем анимацию после монтирования (двойной RAF для гарантии)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsVisible(true);
        });
      });
      return () => {
        closeDialog();
        setIsVisible(false);
      };
    } else {
      setIsVisible(false);
    }
  }, [isOpen, openDialog, closeDialog]);

  // Блокировка скролла при открытом диалоге
  useScrollLock(isOpen);

  if (!isOpen) return null;

  const handleBackdropClick = () => {
    if (onClickBackdrop) {
      onClickBackdrop();
    } else {
      onClose();
    }
  };

  const dialogContent = (
    <>
      <style>{`
        .base-dialog-content-animated {
          will-change: transform, opacity;
          /* Убираем размытие на desktop - четкий рендеринг текста и элементов */
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          text-rendering: optimizeLegibility;
          image-rendering: -webkit-optimize-contrast;
          image-rendering: crisp-edges;
          /* Принудительное использование GPU без размытия */
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        @media (max-width: 768px) {
          .base-dialog-content-animated {
            transform-origin: center center;
          }
        }
        
        /* Гарантируем, что overflow-y-auto применяется */
        .base-dialog-content-animated .overflow-y-auto {
          overflow-y: auto !important;
          overflow-x: hidden !important;
          }
        
        /* Ограничиваем диалог снизу, чтобы не накладывался на BottomBar */
        .base-dialog-content-animated {
          /* Максимальная высота с учетом BottomBar (80px) + safe area + отступ (6rem для безопасности) */
          max-height: calc(100vh - 80px - env(safe-area-inset-bottom, 0px) - 6rem) !important;
        }
        
        /* На мобильных устройствах увеличиваем размер диалогов */
        @media (max-width: 768px) {
          .base-dialog-content-animated {
            /* Увеличиваем максимальную высоту на мобильных, оставляя минимальный отступ (6rem для безопасности) */
            max-height: calc(100vh - 80px - env(safe-area-inset-bottom, 0px) - 6rem) !important;
          }
        }
        
        /* Четкий рендеринг всех элементов внутри диалога на desktop */
        @media (min-width: 769px) {
          .base-dialog-content-animated * {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            text-rendering: optimizeLegibility;
          }
          
          .base-dialog-content-animated svg,
          .base-dialog-content-animated img,
          .base-dialog-content-animated canvas {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
          }
        }
      `}</style>
      {/* Backdrop - единообразное затемнение без blur */}
      <div
        className={`fixed inset-0 z-[9999] ${className}`}
        onClick={(e) => {
          // Закрываем только если клик был именно на backdrop, а не на дочерних элементах
          if (e.target === e.currentTarget) {
            handleBackdropClick();
          }
        }}
        style={{
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'none', // Явно убираем blur
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: '5rem', // Отступ для BottomBar
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 0.3s ease-out',
        }}
      />
      
      {/* Dialog Content */}
      <div
        className={`base-dialog-content-animated fixed left-1/2 top-1/2 z-[10000] w-[calc(100%-2rem)] sm:w-full ${maxWidth} flex flex-col rounded-2xl md:rounded-3xl ${contentClassName}`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          transform: isVisible 
            ? (isMobile ? 'translate(-50%, -50%) scale(1)' : 'translate3d(-50%, -50%, 0) scale(1)')
            : (isMobile ? `translate(-50%, -50%) scale(0.96)` : `translate3d(-50%, -50%, 0) scale(0.92)`),
          opacity: isVisible ? 1 : 0,
          transition: isVisible 
            ? `transform ${isMobile ? '0.4s' : '0.35s'} cubic-bezier(0.16, 1, 0.3, 1), opacity ${isMobile ? '0.4s' : '0.35s'} ease-out`
            : 'transform 0.2s ease-in, opacity 0.2s ease-in',
          background: 'linear-gradient(135deg, rgba(10, 14, 39, 1) 0%, rgba(5, 8, 18, 1) 100%)',
          backdropFilter: 'none',
          border: '2px solid rgba(220, 235, 245, 0.2)',
          boxShadow: `
            0 0 30px rgba(180, 220, 240, 0.2),
            inset 0 0 30px rgba(200, 230, 245, 0.03)
          `,
          // Дополнительные свойства для четкого рендеринга на desktop
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        {/* Holographic grid overlay */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(rgba(200, 230, 245, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(200, 230, 245, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px',
            }}
          />
        </div>


        {/* Children content - с поддержкой скролла */}
        <div className="relative z-10 flex-1 flex flex-col min-h-0">{children}</div>
      </div>
    </>
  );

  // Рендерим через Portal на уровне body
  return createPortal(dialogContent, document.body);
};

export default BaseDialog;


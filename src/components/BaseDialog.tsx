import React, { useEffect, ReactNode } from 'react';
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

  // Управление модальным контекстом и блокировкой скролла
  useEffect(() => {
    if (isOpen) {
      openDialog();
      return () => {
        closeDialog();
      };
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
        @keyframes baseDialogBackdropFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes baseDialogContentFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes baseDialogContentFadeInMobile {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        .base-dialog-backdrop {
          animation: baseDialogBackdropFadeIn 0.3s ease-out forwards;
        }
        
        .base-dialog-content {
          animation: baseDialogContentFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        @media (max-width: 768px) {
          .base-dialog-content {
            animation: baseDialogContentFadeInMobile 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          }
        }
      `}</style>
      {/* Backdrop - единообразное затемнение без blur */}
      <div
        className={`base-dialog-backdrop fixed inset-0 z-[9999] ${className}`}
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
        }}
      />
      
      {/* Dialog Content */}
      <div
        className={`base-dialog-content fixed left-1/2 top-1/2 z-[10000] w-[calc(100%-2rem)] sm:w-full ${maxWidth} ${maxHeight} flex flex-col rounded-2xl md:rounded-3xl ${contentClassName}`}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
        style={{
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(5, 8, 18, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(220, 235, 245, 0.2)',
          boxShadow: `
            0 0 30px rgba(180, 220, 240, 0.2),
            inset 0 0 30px rgba(200, 230, 245, 0.03)
          `,
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

        {/* Glowing orbs */}
        <div
          className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{
            background: 'rgba(180, 216, 232, 0.8)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-10"
          style={{
            background: 'rgba(200, 230, 245, 0.6)',
          }}
        />

        {/* Children content - с поддержкой скролла */}
        <div className="relative z-10 flex-1 flex flex-col min-h-0">{children}</div>
      </div>
    </>
  );

  // Рендерим через Portal на уровне body
  return createPortal(dialogContent, document.body);
};

export default BaseDialog;


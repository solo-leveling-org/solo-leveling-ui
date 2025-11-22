import React, { useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface ConfirmDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmText,
  cancelText
}) => {
  const { t } = useLocalization();

  // Блокируем скролл при открытом диалоге
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <>
      <style>{`
        @keyframes confirmDialogFadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .confirm-dialog-content {
          animation: confirmDialogFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-50"
        onClick={handleCancel}
        style={{
          background: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)'
        }}
      >
        <div
          className="confirm-dialog-content relative w-full max-w-md rounded-2xl md:rounded-3xl"
          onClick={e => e.stopPropagation()}
          style={{
            background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(5, 8, 18, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(220, 235, 245, 0.2)',
            boxShadow: `
              0 0 30px rgba(180, 220, 240, 0.2),
              inset 0 0 30px rgba(200, 230, 245, 0.03)
            `
          }}
        >
          {/* Holographic grid overlay */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `
                linear-gradient(rgba(200, 230, 245, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(200, 230, 245, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          {/* Glowing orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10" style={{
            background: 'rgba(180, 216, 232, 0.8)'
          }}></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-10" style={{
            background: 'rgba(200, 230, 245, 0.6)'
          }}></div>

          {/* Content */}
          <div className="relative z-10 p-6">
            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div 
                className="inline-flex items-center justify-center w-16 h-16 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(180, 220, 240, 0.2) 0%, rgba(160, 210, 235, 0.15) 100%)',
                  border: '2px solid rgba(220, 235, 245, 0.3)',
                  boxShadow: '0 0 20px rgba(180, 220, 240, 0.3)'
                }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{
                  color: '#e8f4f8',
                  filter: 'drop-shadow(0 0 4px rgba(180, 220, 240, 0.5))'
                }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            {/* Message */}
            <div className="text-center mb-6">
              <p 
                className="text-lg leading-relaxed font-tech"
                style={{
                  color: '#e8f4f8',
                  textShadow: '0 0 4px rgba(180, 220, 240, 0.2)'
                }}
              >
                {message}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleCancel}
                className="flex-1 px-6 py-3 font-tech text-sm tracking-[0.15em] uppercase rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.9) 0%, rgba(5, 8, 18, 0.95) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderColor: 'rgba(220, 235, 245, 0.3)',
                  boxShadow: '0 0 15px rgba(180, 220, 240, 0.15)',
                  color: '#e8f4f8'
                }}
              >
                <span className="relative z-10 transition-colors duration-300 hover:text-white">
                  {cancelText || t('common.cancel')}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 px-6 py-3 font-tech text-sm tracking-[0.15em] uppercase rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 border-2"
                style={{
                  background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.9) 0%, rgba(5, 8, 18, 0.95) 100%)',
                  backdropFilter: 'blur(10px)',
                  borderColor: 'rgba(180, 220, 240, 0.4)',
                  boxShadow: '0 0 20px rgba(180, 220, 240, 0.25)',
                  color: '#e8f4f8'
                }}
              >
                <span className="relative z-10 transition-colors duration-300 hover:text-white">
                  {confirmText || t('common.confirm')}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;

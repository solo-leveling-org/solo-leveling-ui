import React from 'react';
import { useLocalization } from '../hooks/useLocalization';
import BaseDialog from './BaseDialog';

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

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={handleCancel}
      maxWidth="max-w-md"
    >

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
    </BaseDialog>
  );
};

export default ConfirmDialog;

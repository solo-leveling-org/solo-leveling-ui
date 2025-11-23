import React, { useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useLocalization } from '../hooks/useLocalization';
import { useModal } from '../contexts/ModalContext';
import { useScrollLock } from '../hooks/useScrollLock';
import { TelegramIcon } from './TelegramWidget';
import Icon from './Icon';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Card } from './ui/card';
import { cn } from '../utils';

type SettingsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const { settings, setLanguage, setIsManual } = useSettings();
  const { t } = useLocalization();
  const { openDialog, closeDialog } = useModal();

  // Блокируем скролл при открытом диалоге и убираем фокус с кнопки закрытия
  useEffect(() => {
    if (isOpen) {
      openDialog();

      // Убираем фокус с кнопки закрытия
      setTimeout(() => {
        const closeButton = document.querySelector('.settings-dialog-content button[class*="absolute right-4 top-4"]') as HTMLElement;
        if (closeButton) {
          closeButton.blur();
          closeButton.setAttribute('tabIndex', '-1');
        }
      }, 0);

      return () => {
        closeDialog();
      };
    }
  }, [isOpen, openDialog, closeDialog]);

  // Используем хук для блокировки скролла
  useScrollLock(isOpen);

  return (
    <>
      <style>{`
        @keyframes dialogFadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes dialogFadeOut {
          from {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
          to {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.9);
          }
        }
        
        .settings-dialog-content[data-state="open"] {
          animation: dialogFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        .settings-dialog-content[data-state="closed"] {
          animation: dialogFadeOut 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        
        /* Style the close button inside settings dialog */
        .settings-dialog-content button[class*="absolute right-4 top-4"] {
          color: #e8f4f8 !important;
          opacity: 0.7 !important;
          transition: all 0.2s ease !important;
          width: 32px !important;
          height: 32px !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          border-radius: 8px !important;
          background: rgba(220, 235, 245, 0.05) !important;
          border: 1px solid rgba(220, 235, 245, 0.2) !important;
          z-index: 100 !important;
          pointer-events: auto !important;
          outline: none !important;
          box-shadow: none !important;
        }
        
        .settings-dialog-content button[class*="absolute right-4 top-4"]:focus {
          outline: none !important;
          box-shadow: none !important;
          ring: none !important;
        }
        
        .settings-dialog-content button[class*="absolute right-4 top-4"]:hover {
          opacity: 1 !important;
          color: #ffffff !important;
          transform: rotate(90deg) scale(1.1) !important;
          filter: drop-shadow(0 0 8px rgba(180, 220, 240, 0.6)) !important;
          background: rgba(220, 235, 245, 0.1) !important;
          border-color: rgba(220, 235, 245, 0.4) !important;
        }
        
        .settings-dialog-content button[class*="absolute right-4 top-4"] svg {
          width: 18px !important;
          height: 18px !important;
        }
      `}</style>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          closeDialog();
          onClose();
        }
      }}>
        <DialogContent
          className="settings-dialog-content border-0 shadow-none bg-transparent p-0 max-w-md"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(5, 8, 18, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(220, 235, 245, 0.2)',
            borderRadius: '24px',
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

        <div className="relative z-10">
          {/* Header */}
          <DialogHeader className="p-6 pb-4 border-b relative" style={{
            borderColor: 'rgba(220, 235, 245, 0.1)',
            zIndex: 10
          }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="profile-icon-wrapper"
                  style={{
                    color: '#e8f4f8',
                    filter: 'drop-shadow(0 0 8px rgba(180, 220, 240, 0.4))'
                  }}
                >
                  <Icon type="settings" size={28} />
                </div>
                <DialogTitle 
                  className="font-tech text-xl font-bold m-0"
                  style={{
                    color: '#e8f4f8',
                    textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
                  }}
                >
                  {t('profile.settings.title')}
                </DialogTitle>
              </div>
            </div>
          </DialogHeader>

          {/* Content */}
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Language Source Setting */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="profile-icon-wrapper"
                  style={{
                    color: 'rgba(220, 235, 245, 0.7)',
                    filter: 'drop-shadow(0 0 4px rgba(200, 230, 245, 0.3))'
                  }}
                >
                  <Icon type="globe" size={24} />
                </div>
                <div>
                  <DialogDescription 
                    className="font-tech font-bold text-sm m-0"
                    style={{ color: '#e8f4f8' }}
                  >
                    {t('profile.settings.language.sourceTitle')}
                  </DialogDescription>
                  <DialogDescription 
                    className="text-xs mt-1 m-0"
                    style={{ color: 'rgba(220, 235, 245, 0.6)' }}
                  >
                    {t('profile.settings.language.sourceDescription')}
                  </DialogDescription>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {/* Telegram source */}
                <Card
                  onClick={() => setIsManual(false)}
                  className={cn(
                    "relative p-4 cursor-pointer transition-all duration-200 border-0 shadow-none bg-transparent",
                    !settings.isManual && "scale-105"
                  )}
                  style={{
                    background: !settings.isManual
                      ? 'linear-gradient(135deg, rgba(180, 220, 240, 0.15) 0%, rgba(160, 210, 235, 0.08) 100%)'
                      : 'rgba(220, 235, 245, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: !settings.isManual
                      ? '1px solid rgba(220, 235, 245, 0.4)'
                      : '1px solid rgba(220, 235, 245, 0.15)',
                    boxShadow: !settings.isManual
                      ? '0 0 15px rgba(180, 220, 240, 0.2)'
                      : 'none'
                  }}
                >
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <div
                        style={{
                          color: !settings.isManual ? '#e8f4f8' : 'rgba(220, 235, 245, 0.6)',
                          filter: !settings.isManual ? 'drop-shadow(0 0 6px rgba(180, 220, 240, 0.5))' : 'none'
                        }}
                      >
                        <TelegramIcon className="w-6 h-6" />
                      </div>
                    </div>
                    <div 
                      className="font-tech text-xs font-semibold"
                      style={{
                        color: !settings.isManual ? '#e8f4f8' : 'rgba(220, 235, 245, 0.6)'
                      }}
                    >
                      {t('profile.settings.language.useTelegram')}
                    </div>
                  </div>
                  {!settings.isManual && (
                    <div 
                      className="absolute top-2 right-2 w-2 h-2 rounded-full"
                      style={{
                        background: '#e8f4f8',
                        boxShadow: '0 0 8px rgba(180, 220, 240, 0.8)'
                      }}
                    ></div>
                  )}
                </Card>

                {/* Manual source */}
                <Card
                  onClick={() => setIsManual(true)}
                  className={cn(
                    "relative p-4 cursor-pointer transition-all duration-200 border-0 shadow-none bg-transparent",
                    settings.isManual && "scale-105"
                  )}
                  style={{
                    background: settings.isManual
                      ? 'linear-gradient(135deg, rgba(180, 220, 240, 0.15) 0%, rgba(160, 210, 235, 0.08) 100%)'
                      : 'rgba(220, 235, 245, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: settings.isManual
                      ? '1px solid rgba(220, 235, 245, 0.4)'
                      : '1px solid rgba(220, 235, 245, 0.15)',
                    boxShadow: settings.isManual
                      ? '0 0 15px rgba(180, 220, 240, 0.2)'
                      : 'none'
                  }}
                >
                  <div className="text-center">
                    <div className="flex justify-center items-center mb-2">
                      <div
                        className="profile-icon-wrapper"
                        style={{
                          color: settings.isManual ? '#e8f4f8' : 'rgba(220, 235, 245, 0.6)',
                          filter: settings.isManual ? 'drop-shadow(0 0 6px rgba(180, 220, 240, 0.5))' : 'none'
                        }}
                      >
                        <Icon type="wrench" size={24} />
                      </div>
                    </div>
                    <div 
                      className="font-tech text-xs font-semibold"
                      style={{
                        color: settings.isManual ? '#e8f4f8' : 'rgba(220, 235, 245, 0.6)'
                      }}
                    >
                      {t('profile.settings.language.chooseManually')}
                    </div>
                  </div>
                  {settings.isManual && (
                    <div 
                      className="absolute top-2 right-2 w-2 h-2 rounded-full"
                      style={{
                        background: '#e8f4f8',
                        boxShadow: '0 0 8px rgba(180, 220, 240, 0.8)'
                      }}
                    ></div>
                  )}
                </Card>
              </div>

              {/* Manual language selection */}
              <div 
                className={cn(
                  "grid grid-cols-2 gap-3 transition-opacity duration-300",
                  !settings.isManual && "opacity-40 pointer-events-none"
                )}
              >
                {/* Russian */}
                <Card
                  onClick={() => setLanguage('ru')}
                  className={cn(
                    "relative p-4 cursor-pointer transition-all duration-200 border-0 shadow-none bg-transparent",
                    settings.language === 'ru' && "scale-105"
                  )}
                  style={{
                    background: settings.language === 'ru'
                      ? 'linear-gradient(135deg, rgba(180, 220, 240, 0.15) 0%, rgba(160, 210, 235, 0.08) 100%)'
                      : 'rgba(220, 235, 245, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: settings.language === 'ru'
                      ? '1px solid rgba(220, 235, 245, 0.4)'
                      : '1px solid rgba(220, 235, 245, 0.15)',
                    boxShadow: settings.language === 'ru'
                      ? '0 0 15px rgba(180, 220, 240, 0.2)'
                      : 'none'
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🇷🇺</div>
                    <div 
                      className="font-tech text-xs font-semibold"
                      style={{
                        color: settings.language === 'ru' ? '#e8f4f8' : 'rgba(220, 235, 245, 0.6)'
                      }}
                    >
                      {t('profile.settings.language.russian')}
                    </div>
                  </div>
                  {settings.language === 'ru' && (
                    <div 
                      className="absolute top-2 right-2 w-2 h-2 rounded-full"
                      style={{
                        background: '#e8f4f8',
                        boxShadow: '0 0 8px rgba(180, 220, 240, 0.8)'
                      }}
                    ></div>
                  )}
                </Card>

                {/* English */}
                <Card
                  onClick={() => setLanguage('en')}
                  className={cn(
                    "relative p-4 cursor-pointer transition-all duration-200 border-0 shadow-none bg-transparent",
                    settings.language === 'en' && "scale-105"
                  )}
                  style={{
                    background: settings.language === 'en'
                      ? 'linear-gradient(135deg, rgba(180, 220, 240, 0.15) 0%, rgba(160, 210, 235, 0.08) 100%)'
                      : 'rgba(220, 235, 245, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: settings.language === 'en'
                      ? '1px solid rgba(220, 235, 245, 0.4)'
                      : '1px solid rgba(220, 235, 245, 0.15)',
                    boxShadow: settings.language === 'en'
                      ? '0 0 15px rgba(180, 220, 240, 0.2)'
                      : 'none'
                  }}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🇺🇸</div>
                    <div 
                      className="font-tech text-xs font-semibold"
                      style={{
                        color: settings.language === 'en' ? '#e8f4f8' : 'rgba(220, 235, 245, 0.6)'
                      }}
                    >
                      {t('profile.settings.language.english')}
                    </div>
                  </div>
                  {settings.language === 'en' && (
                    <div 
                      className="absolute top-2 right-2 w-2 h-2 rounded-full"
                      style={{
                        background: '#e8f4f8',
                        boxShadow: '0 0 8px rgba(180, 220, 240, 0.8)'
                      }}
                    ></div>
                  )}
                </Card>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
};

export default SettingsDialog;

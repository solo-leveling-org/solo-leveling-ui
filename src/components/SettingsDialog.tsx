import React, { useEffect } from 'react';
import { useSettings } from '../hooks/useSettings';
import { useLocalization } from '../hooks/useLocalization';
import { TelegramIcon } from './TelegramWidget';
import Icon from './Icon';

type SettingsDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

const SettingsDialog: React.FC<SettingsDialogProps> = ({ isOpen, onClose }) => {
  const { settings, setLanguage, setIsManual } = useSettings();
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

  const handleClose = () => {
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-dialog-backdrop"
      onClick={handleClose}
    >
      <div
        className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md animate-dialog-content"
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-2xl translate-y-4 -translate-x-4"></div>

        {/* Header */}
        <div className="relative z-10 p-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Icon type="settings" size={32} className="mr-3" />
              <h2 className="text-xl font-bold text-gray-800">{t('profile.settings.title')}</h2>
            </div>
            <button
              onClick={handleClose}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100/50 backdrop-blur-sm hover:bg-gray-200/50 transition-all duration-200 hover:scale-110 group"
            >
              <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors"
                   fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 px-6 pb-6">
          {/* Language Source Setting */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Icon type="globe" size={24} className="mr-3 text-gray-600" />
                <div>
                  <div className="font-bold text-gray-800 text-base">{t('profile.settings.language.sourceTitle')}</div>
                  <div className="text-sm text-slate-500">{t('profile.settings.language.sourceDescription')}</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => setIsManual(false)}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  !settings.isManual
                    ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-lg'
                    : 'border-gray-200 bg-white/50 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <TelegramIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className={`font-semibold text-sm ${
                    !settings.isManual ? 'text-blue-700' : 'text-gray-600'
                  }`}>
                    {t('profile.settings.language.useTelegram')}
                  </div>
                </div>
                {!settings.isManual && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setIsManual(true)}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  settings.isManual
                    ? 'border-emerald-500 bg-gradient-to-r from-emerald-50 to-emerald-100/50 shadow-lg'
                    : 'border-gray-200 bg-white/50 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="flex justify-center items-center mb-2">
                    <Icon type="wrench" size={24} className="text-gray-500" />
                  </div>
                  <div className={`font-semibold text-sm ${
                    settings.isManual ? 'text-emerald-700' : 'text-gray-600'
                  }`}>
                    {t('profile.settings.language.chooseManually')}
                  </div>
                </div>
                {settings.isManual && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-emerald-500 rounded-full"></div>
                )}
              </button>
            </div>

            {/* Manual language selection (enabled only when manual source) */}
            <div className={`grid grid-cols-2 gap-3 ${!settings.isManual ? 'opacity-50 pointer-events-none' : ''}`}>
              <button
                onClick={() => setLanguage('ru')}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  settings.language === 'ru'
                    ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100/50 shadow-lg'
                    : 'border-gray-200 bg-white/50 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🇷🇺</div>
                  <div className={`font-semibold text-sm ${
                    settings.language === 'ru' ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {t('profile.settings.language.russian')}
                  </div>
                </div>
                {settings.language === 'ru' && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                )}
              </button>

              <button
                onClick={() => setLanguage('en')}
                className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                  settings.language === 'en'
                    ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100/50 shadow-lg'
                    : 'border-gray-200 bg-white/50 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">🇺🇸</div>
                  <div className={`font-semibold text-sm ${
                    settings.language === 'en' ? 'text-green-700' : 'text-gray-600'
                  }`}>
                    {t('profile.settings.language.english')}
                  </div>
                </div>
                {settings.language === 'en' && (
                  <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                )}
              </button>
            </div>
          </div>

          {/* Close Button */}
          <div className="text-center">
            <button
              onClick={handleClose}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsDialog;

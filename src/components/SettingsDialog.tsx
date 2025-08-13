import React, { useState } from 'react';
import { Theme, Language } from '../hooks/useSettings';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: Theme;
  currentLanguage: Language;
  onThemeChange: (theme: Theme) => void;
  onLanguageChange: (language: Language) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose,
  currentTheme,
  currentLanguage,
  onThemeChange,
  onLanguageChange
}) => {
  const [localTheme, setLocalTheme] = useState<Theme>(currentTheme);
  const [localLanguage, setLocalLanguage] = useState<Language>(currentLanguage);

  const handleSave = () => {
    onThemeChange(localTheme);
    onLanguageChange(localLanguage);
    onClose();
  };

  const handleCancel = () => {
    setLocalTheme(currentTheme);
    setLocalLanguage(currentLanguage);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000] transition-all duration-300"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4">
        <div className="relative w-full max-w-md">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-3xl -z-10 transform scale-105"></div>

          {/* Main card */}
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/30 to-purple-400/30 rounded-full blur-2xl -translate-y-8 translate-x-8"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/30 to-orange-400/30 rounded-full blur-xl translate-y-4 -translate-x-4"></div>

            {/* Content */}
            <div className="relative z-10">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="text-3xl mb-3">⚙️</div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
                  Настройки
                </h2>
                <p className="text-slate-500 text-sm">Персонализируйте свое приложение</p>
              </div>

              {/* Theme Setting */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">🎨</div>
                    <div>
                      <div className="font-semibold text-gray-800">Тема</div>
                      <div className="text-sm text-slate-500">Выберите внешний вид</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLocalTheme('light')}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                      localTheme === 'light'
                        ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-lg'
                        : 'border-gray-200 bg-white/50 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">☀️</div>
                      <div className={`font-medium text-sm ${
                        localTheme === 'light' ? 'text-blue-700' : 'text-gray-600'
                      }`}>
                        Светлая
                      </div>
                    </div>
                    {localTheme === 'light' && (
                      <div className="absolute top-2 right-2 w-3 h-3 bg-blue-500 rounded-full"></div>
                    )}
                  </button>

                  <button
                    onClick={() => setLocalTheme('dark')}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                      localTheme === 'dark'
                        ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100/50 shadow-lg'
                        : 'border-gray-200 bg-white/50 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🌙</div>
                      <div className={`font-medium text-sm ${
                        localTheme === 'dark' ? 'text-purple-700' : 'text-gray-600'
                      }`}>
                        Темная
                      </div>
                    </div>
                    {localTheme === 'dark' && (
                      <div className="absolute top-2 right-2 w-3 h-3 bg-purple-500 rounded-full"></div>
                    )}
                  </button>
                </div>
              </div>

              {/* Language Setting */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-2xl mr-3">🌍</div>
                    <div>
                      <div className="font-semibold text-gray-800">Язык</div>
                      <div className="text-sm text-slate-500">Выберите язык интерфейса</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setLocalLanguage('ru')}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                      localLanguage === 'ru'
                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100/50 shadow-lg'
                        : 'border-gray-200 bg-white/50 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🇷🇺</div>
                      <div className={`font-medium text-sm ${
                        localLanguage === 'ru' ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        Русский
                      </div>
                    </div>
                    {localLanguage === 'ru' && (
                      <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                  </button>

                  <button
                    onClick={() => setLocalLanguage('en')}
                    className={`relative p-4 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                      localLanguage === 'en'
                        ? 'border-green-500 bg-gradient-to-r from-green-50 to-green-100/50 shadow-lg'
                        : 'border-gray-200 bg-white/50 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">🇺🇸</div>
                      <div className={`font-medium text-sm ${
                        localLanguage === 'en' ? 'text-green-700' : 'text-gray-600'
                      }`}>
                        English
                      </div>
                    </div>
                    {localLanguage === 'en' && (
                      <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                    )}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 relative overflow-hidden bg-white/20 backdrop-blur-sm border border-white/30 text-gray-600 rounded-2xl px-6 py-3 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:bg-gray-50/30"
                >
                  <span className="relative z-10">Отмена</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-slate-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </button>

                <button
                  onClick={handleSave}
                  className="flex-1 relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl px-6 py-3 text-sm font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span className="relative z-10">Сохранить</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsDialog;

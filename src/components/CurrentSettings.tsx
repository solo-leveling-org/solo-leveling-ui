import React from 'react';
import { Theme, Language } from '../hooks/useSettings';

interface CurrentSettingsProps {
  theme: Theme;
  language: Language;
}

const CurrentSettings: React.FC<CurrentSettingsProps> = ({ theme, language }) => {
  const getThemeIcon = (theme: Theme) => {
    return theme === 'light' ? '☀️' : '🌙';
  };

  const getLanguageIcon = (language: Language) => {
    return language === 'ru' ? '🇷🇺' : '🇺🇸';
  };

  const getThemeLabel = (theme: Theme) => {
    return theme === 'light' ? 'Светлая' : 'Темная';
  };

  const getLanguageLabel = (language: Language) => {
    return language === 'ru' ? 'Русский' : 'English';
  };

  return (
    <div className="bg-gradient-to-r from-slate-50 to-gray-50 backdrop-blur-sm rounded-2xl p-4 border border-slate-200/30 mb-6">
      <div className="text-center mb-3">
        <div className="text-sm font-medium text-slate-600 mb-2">Текущие настройки</div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="flex items-center justify-center space-x-2 bg-white/50 rounded-xl p-3 border border-slate-200/30">
          <span className="text-lg">{getThemeIcon(theme)}</span>
          <span className="text-sm font-medium text-slate-700">{getThemeLabel(theme)}</span>
        </div>
        
        <div className="flex items-center justify-center space-x-2 bg-white/50 rounded-xl p-3 border border-slate-200/30">
          <span className="text-lg">{getLanguageIcon(language)}</span>
          <span className="text-sm font-medium text-slate-700">{getLanguageLabel(language)}</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentSettings;

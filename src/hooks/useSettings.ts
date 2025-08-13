import { useState, useEffect } from 'react';

export type Theme = 'light' | 'dark';
export type Language = 'ru' | 'en';

interface Settings {
  theme: Theme;
  language: Language;
}

const defaultSettings: Settings = {
  theme: 'light',
  language: 'ru'
};

const STORAGE_KEY = 'solo-leveling-settings';

export const useSettings = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Загружаем настройки из localStorage при инициализации
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Сохраняем настройки в localStorage при изменении
  const updateSettings = (newSettings: Partial<Settings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const setTheme = (theme: Theme) => {
    updateSettings({ theme });
    applyTheme(theme);
  };

  const setLanguage = (language: Language) => {
    updateSettings({ language });
    applyLanguage(language);
  };

  const updateMultipleSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      
      // Применяем тему, если она изменилась
      if (newSettings.theme !== settings.theme) {
        applyTheme(newSettings.theme);
      }
      
      // Применяем язык, если он изменился
      if (newSettings.language !== settings.language) {
        applyLanguage(newSettings.language);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const applyTheme = (theme: Theme) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const applyLanguage = (language: Language) => {
    // Здесь будет логика смены языка
  };

  // Применяем текущую тему при загрузке
  useEffect(() => {
    if (isLoaded) {
      applyTheme(settings.theme);
    }
  }, [isLoaded, settings.theme]);

  return {
    settings,
    isLoaded,
    setTheme,
    setLanguage,
    updateSettings,
    updateMultipleSettings
  };
};

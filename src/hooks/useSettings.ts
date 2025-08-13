import { useState, useEffect } from 'react';

export type Language = 'ru' | 'en';

interface Settings {
  language: Language;
}

const defaultSettings: Settings = {
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

  const setLanguage = (language: Language) => {
    updateSettings({ language });
    applyLanguage(language);
  };

  const updateMultipleSettings = (newSettings: Settings) => {
    setSettings(newSettings);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      // Применяем язык, если он изменился
      if (newSettings.language !== settings.language) {
        applyLanguage(newSettings.language);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const applyLanguage = (language: Language) => {
    // Здесь будет логика смены языка
  };

  return {
    settings,
    isLoaded,
    setLanguage,
    updateSettings,
    updateMultipleSettings
  };
};

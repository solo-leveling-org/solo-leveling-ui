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
    // Здесь будет логика применения темы
    applyTheme(theme);
  };

  const setLanguage = (language: Language) => {
    updateSettings({ language });
    // Здесь будет логика смены языка
    applyLanguage(language);
  };

  const applyTheme = (theme: Theme) => {
    // Применение темы к документу
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Здесь можно добавить дополнительную логику для применения темы
    console.log('Theme applied:', theme);
  };

  const applyLanguage = (language: Language) => {
    // Здесь будет логика смены языка интерфейса
    console.log('Language applied:', language);
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
    updateSettings
  };
};

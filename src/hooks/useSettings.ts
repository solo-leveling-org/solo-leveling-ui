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
    console.log('useSettings: Loading settings from localStorage...');
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      console.log('useSettings: Raw stored data =', stored);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('useSettings: Parsed stored data =', parsed);
        setSettings({ ...defaultSettings, ...parsed });
      } else {
        console.log('useSettings: No stored data found, using defaults');
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setIsLoaded(true);
      console.log('useSettings: Settings loaded, isLoaded = true');
    }
  }, []);

  // Сохраняем настройки в localStorage при изменении
  const updateSettings = (newSettings: Partial<Settings>) => {
    console.log('useSettings: updateSettings called with newSettings =', newSettings);
    const updated = { ...settings, ...newSettings };
    console.log('useSettings: updated settings =', updated);
    setSettings(updated);
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log('useSettings: Settings saved to localStorage');
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const setTheme = (theme: Theme) => {
    console.log('useSettings: setTheme called with theme =', theme);
    updateSettings({ theme });
    // Здесь будет логика применения темы
    applyTheme(theme);
  };

  const setLanguage = (language: Language) => {
    console.log('useSettings: setLanguage called with language =', language);
    updateSettings({ language });
    // Здесь будет логика смены языка
    applyLanguage(language);
  };

  const applyTheme = (theme: Theme) => {
    console.log('useSettings: applyTheme called with theme =', theme);
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
    console.log('useSettings: applyLanguage called with language =', language);
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

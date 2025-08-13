import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type Language = 'ru' | 'en';

interface Settings {
  language: Language;
}

const defaultSettings: Settings = {
  language: 'ru'
};

const STORAGE_KEY = 'solo-leveling-settings';

type SettingsContextValue = {
  settings: Settings;
  isLoaded: boolean;
  setLanguage: (language: Language) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  updateMultipleSettings: (newSettings: Settings) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
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

  // Apply current language once loaded (on initial mount or when language changes)
  useEffect(() => {
    if (isLoaded) {
      applyLanguage(settings.language);
    }
  }, [isLoaded, settings.language]);

  const applyLanguage = (language: Language) => {
    document.documentElement.lang = language;
  };

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
      return updated;
    });
  };

  const setLanguage = (language: Language) => {
    updateSettings({ language });
  };

  const updateMultipleSettings = (newSettings: Settings) => {
    setSettings(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      } catch (error) {
        console.error('Failed to save settings:', error);
      }
      return newSettings;
    });
  };

  const value = useMemo<SettingsContextValue>(() => ({
    settings,
    isLoaded,
    setLanguage,
    updateSettings,
    updateMultipleSettings,
  }), [settings, isLoaded]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = (): SettingsContextValue => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return ctx;
};



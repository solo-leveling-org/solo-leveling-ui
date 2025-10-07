import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserService } from '../api';
import { useTelegram } from '../useTelegram';

export type Language = 'ru' | 'en';
export type LanguageSource = 'telegram' | 'manual';

interface Settings {
  language: Language;
  languageSource: LanguageSource;
}

const defaultSettings: Settings = {
  language: 'ru',
  languageSource: 'telegram',
};

const STORAGE_KEY = 'solo-leveling-settings';

// Утилитарная функция для получения языка из localStorage
export const getLanguageFromStorage = (): Language => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.language || defaultSettings.language;
    }
  } catch (error) {
    console.error('Failed to get language from storage:', error);
  }
  return defaultSettings.language;
};

type SettingsContextValue = {
  settings: Settings;
  isLoaded: boolean;
  setLanguage: (language: Language) => void;
  updateSettings: (newSettings: Partial<Settings>) => void;
  updateMultipleSettings: (newSettings: Settings) => void;
  setLanguageSource: (source: LanguageSource) => void;
};

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useTelegram();

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

  // Derive language from Telegram (or browser) when languageSource is telegram
  useEffect(() => {
    if (!isLoaded) return;
    if (settings.languageSource !== 'telegram') return;
    const derived = deriveLanguageFromTelegram(user?.language_code);
    if (derived !== settings.language) {
      // Only update language, keep source as telegram
      setSettings(prev => {
        const updated = { ...prev, language: derived };
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
          console.error('Failed to save settings:', error);
        }
        return updated;
      });
    }
  }, [isLoaded, settings.languageSource, user?.language_code, settings.language]);

  const deriveLanguageFromTelegram = (code?: string): Language => {
    const raw = (code || (typeof navigator !== 'undefined' ? navigator.language : '')).toLowerCase();
    if (raw.startsWith('ru')) return 'ru';
    return 'en';
  };

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
    // Manual selection overrides telegram source
    updateSettings({ language, languageSource: 'manual' });
    // Persist user locale to backend (manual update)
    try {
      // Fire-and-forget; UI state remains responsive
      void UserService.updateUserLocale({ locale: language });
    } catch (error) {
      console.error('Failed to update user locale on backend:', error);
    }
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

  const setLanguageSource = (source: LanguageSource) => {
    if (source === 'telegram') {
      const derived = deriveLanguageFromTelegram(user?.language_code);
      updateSettings({ languageSource: 'telegram', language: derived });
    } else {
      updateSettings({ languageSource: 'manual' });
    }
  };

  const value: SettingsContextValue = {
    settings,
    isLoaded,
    setLanguage,
    updateSettings,
    updateMultipleSettings,
    setLanguageSource,
  };

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



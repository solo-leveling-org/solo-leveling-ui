import { useMemo } from 'react';
import { useSettings } from './useSettings';
import { locales, type Locale, type Language } from '../locales';

export const useLocalization = () => {
  const { settings, setLanguage, isLoaded } = useSettings();

  const locale: Locale = useMemo(() => {
    return locales[settings.language] || locales.ru;
  }, [settings.language]);

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>) => {
      const keys = key.split('.');
      let value: any = locale;

      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          console.warn(`Translation key not found: ${key}`);
          return key;
        }
      }

      if (typeof value !== 'string') {
        console.warn(`Translation value is not a string: ${key}`);
        return key;
      }

      // Replace parameters in the string
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, param) => {
          return params[param]?.toString() || match;
        });
      }

      return value;
    };
  }, [locale]);

  // ✅ Теперь changeLanguage работает правильно!
  const changeLanguage = (language: Language) => {
    setLanguage(language);
  };

  return {
    locale,
    t,
    currentLanguage: settings.language,
    changeLanguage,
    isLoaded,
  };
};

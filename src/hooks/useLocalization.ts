import { useCallback, useEffect } from 'react';
import { useSettings } from './useSettings';
import { type Language } from '../locales';
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';

export const useLocalization = () => {
  const { settings, setLanguage, isLoaded } = useSettings();
  const { t } = useTranslation();

  // Keep i18n in sync with settings.language
  useEffect(() => {
    if (settings.language && i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language);
    }
  }, [settings.language]);

  const changeLanguage = useCallback((language: Language) => {
    setLanguage(language);
    i18n.changeLanguage(language);
  }, [setLanguage]);

  return {
    t,
    currentLanguage: settings.language,
    changeLanguage,
    isLoaded,
  };
};

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { locales } from './locales';
import { Language } from './hooks/useSettings';

// Build flat resource object per namespace
const resources: Record<string, { translation: any }> = {
  ru: { translation: locales.ru },
  en: { translation: locales.en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: { escapeValue: false },
    // We use dot notation keys already
    keySeparator: '.',
    ns: ['translation'],
    defaultNS: 'translation',
    returnNull: false,
    returnEmptyString: false,
  });

export async function applyI18nLanguage(lang: Language) {
  if (i18n.language !== lang) {
    await i18n.changeLanguage(lang);
  }
}

export default i18n;



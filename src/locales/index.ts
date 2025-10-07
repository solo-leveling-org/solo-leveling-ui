import { ru } from './ru';
import { en } from './en';

export type Language = 'ru' | 'en';

export type Locale = typeof ru;

export const locales: Record<Language, Locale> = {
  ru,
  en,
};

// Список поддерживаемых языков
export const SUPPORTED_LANGUAGES: Language[] = ['ru', 'en'];

// Функция для безопасного преобразования строки в поддерживаемый язык
export const parseLanguage = (locale: string): Language => {
  const normalized = locale.toLowerCase();
  
  // Проверяем точные совпадения
  if (SUPPORTED_LANGUAGES.includes(normalized as Language)) {
    return normalized as Language;
  }
  
  // Проверяем префиксы (ru-RU, en-US и т.д.)
  if (normalized.startsWith('ru')) return 'ru';
  if (normalized.startsWith('en')) return 'en';
  
  // По умолчанию возвращаем русский
  return 'ru';
};

export { ru, en };

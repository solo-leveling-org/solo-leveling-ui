import { ru } from './ru';
import { en } from './en';

export type Language = 'ru' | 'en';

export type Locale = typeof ru;

export const locales: Record<Language, Locale> = {
  ru,
  en,
};

export { ru, en };

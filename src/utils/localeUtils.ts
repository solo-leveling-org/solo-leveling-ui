import { UserService } from '../api';
import { parseLanguage, type Language } from '../locales';

/**
 * Функция для получения и обновления локализации пользователя с сервера
 * @param updateSettings - функция для обновления настроек из useSettings
 * @param setLocaleLoaded - функция для установки флага загрузки локализации (опционально)
 * @returns Promise с результатом обновления
 */
export const fetchAndUpdateUserLocale = async (
  updateSettings: (settings: { language: Language; isManual: boolean }) => void,
  setLocaleLoaded?: (loaded: boolean) => void
): Promise<void> => {
  try {
    const response = await UserService.getUserAdditionalInfo();
    
    // Проверяем наличие locale в ответе
    if (response.locale && response.locale.tag) {
      const backendLanguage = parseLanguage(response.locale.tag);
      
      // Обновляем настройки локализации
      updateSettings({
        language: backendLanguage,
        isManual: response.locale.isManual
      });
      
      console.log('[Locale] Updated locale from server:', backendLanguage);
    } else {
      console.log('[Locale] No locale information in response');
    }
    
    // Устанавливаем флаг загрузки если функция предоставлена
    if (setLocaleLoaded) {
      setLocaleLoaded(true);
    }
  } catch (error) {
    console.error('[Locale] Failed to update locale:', error);
    
    // Устанавливаем флаг загрузки даже при ошибке, чтобы не блокировать UI
    if (setLocaleLoaded) {
      setLocaleLoaded(true);
    }
    
    throw error;
  }
};

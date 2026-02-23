import { UserService } from '../api';
import type { UserAdditionalInfoResponse } from '../api';
import { parseLanguage, type Language } from '../locales';

/**
 * Применяет локаль из ответа getAdditionalInfo к настройкам (без отдельного запроса).
 */
export const applyLocaleFromAdditionalInfoResponse = (
  response: UserAdditionalInfoResponse,
  updateSettings: (settings: { language: Language; isManual: boolean }) => void,
  setLocaleLoaded?: (loaded: boolean) => void
): void => {
  if (response.locale && response.locale.tag) {
    const backendLanguage = parseLanguage(response.locale.tag);
    updateSettings({
      language: backendLanguage,
      isManual: response.locale.isManual
    });
    console.log('[Locale] Updated locale from server:', backendLanguage);
  } else {
    console.log('[Locale] No locale information in response');
  }
  if (setLocaleLoaded) setLocaleLoaded(true);
};

/**
 * Запрашивает getAdditionalInfo и обновляет локаль (отдельный запрос; для WebSocket/обновления локали).
 */
export const fetchAndUpdateUserLocale = async (
  updateSettings: (settings: { language: Language; isManual: boolean }) => void,
  setLocaleLoaded?: (loaded: boolean) => void
): Promise<void> => {
  try {
    const response = await UserService.getUserAdditionalInfo();
    applyLocaleFromAdditionalInfoResponse(response, updateSettings, setLocaleLoaded);
  } catch (error) {
    console.error('[Locale] Failed to update locale:', error);
    if (setLocaleLoaded) setLocaleLoaded(true);
    throw error;
  }
};

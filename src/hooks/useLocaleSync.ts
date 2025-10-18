import { useState, useEffect } from 'react';
import { useSettings } from './useSettings';
import { fetchAndUpdateUserLocale } from '../utils/localeUtils';

export const useLocaleSync = (isAuthenticated: boolean) => {
  const [localeFetched, setLocaleFetched] = useState(false);
  const { updateSettings, setLocaleLoaded } = useSettings();

  // После успешной авторизации загружаем локаль пользователя с бэкенда (только один раз)
  useEffect(() => {
    if (!isAuthenticated || localeFetched) return;
    
    // Добавляем небольшую задержку, чтобы избежать конфликта с авторизацией
    const timeoutId = setTimeout(() => {
      let isCancelled = false;
      (async () => {
        try {
          if (isCancelled) return;
          console.log('[Locale] Fetching user locale from backend...');
          await fetchAndUpdateUserLocale(updateSettings, setLocaleLoaded);
          setLocaleFetched(true);
        } catch (e) {
          // Не блокируем UI, просто логируем
          console.error('Failed to fetch user locale from backend:', e);
          setLocaleFetched(true); // Помечаем как выполненное даже при ошибке
          setLocaleLoaded(true); // Разрешаем показ контента даже при ошибке
        }
      })();
      return () => { isCancelled = true; };
    }, 100); // 100ms задержка

    return () => { clearTimeout(timeoutId); };
  }, [isAuthenticated, localeFetched, updateSettings, setLocaleLoaded]);

  // Сбрасываем флаг при изменении авторизации
  useEffect(() => {
    if (!isAuthenticated) {
      setLocaleFetched(false);
    }
  }, [isAuthenticated]);

  return {
    localeFetched,
  };
};

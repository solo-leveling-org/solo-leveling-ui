import { useState, useEffect } from 'react';
import { UserService } from '../api';
import { useSettings } from './useSettings';

export const useLocaleSync = (isAuthenticated: boolean) => {
  const [localeFetched, setLocaleFetched] = useState(false);
  const { updateSettings, setLocaleLoaded } = useSettings();

  // После успешной авторизации загружаем локаль пользователя с бэкенда (только один раз)
  useEffect(() => {
    if (!isAuthenticated || localeFetched) return;
    
    let isCancelled = false;
    (async () => {
      try {
        const res = await UserService.getUserLocale();
        if (isCancelled) return;
        const backendLanguage = res.locale === 'ru' ? 'ru' : 'en';
        // Если бэкенд помечает ручной выбор - фиксируем источник как manual, иначе telegram
        updateSettings({
          language: backendLanguage,
          languageSource: res.isManual ? 'manual' : 'telegram'
        });
        setLocaleFetched(true);
        setLocaleLoaded(true); // Разрешаем показ контента после загрузки локализации
      } catch (e) {
        // Не блокируем UI, просто логируем
        console.error('Failed to fetch user locale from backend:', e);
        setLocaleFetched(true); // Помечаем как выполненное даже при ошибке
        setLocaleLoaded(true); // Разрешаем показ контента даже при ошибке
      }
    })();
    return () => { isCancelled = true; };
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

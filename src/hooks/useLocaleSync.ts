import { useState, useEffect } from 'react';
import { UserService } from '../api';
import type { UserAdditionalInfoResponse } from '../api';
import { useSettings } from './useSettings';
import { applyLocaleFromAdditionalInfoResponse } from '../utils/localeUtils';

export const useLocaleSync = (isAuthenticated: boolean) => {
  const [localeFetched, setLocaleFetched] = useState(false);
  const [isLocaleLoading, setIsLocaleLoading] = useState(false);
  const [additionalInfoData, setAdditionalInfoData] = useState<UserAdditionalInfoResponse | null>(null);
  const { updateSettings, setLocaleLoaded, localeLoaded } = useSettings();

  // Один запрос getAdditionalInfo после авторизации: по нему обновляем локаль и отдаём данные в UserAdditionalInfoProvider
  useEffect(() => {
    if (!isAuthenticated || localeFetched) {
      setIsLocaleLoading(false);
      return;
    }

    const timeoutId = setTimeout(() => {
      let isCancelled = false;
      setIsLocaleLoading(true);

      (async () => {
        try {
          if (isCancelled) return;
          console.log('[Locale] Fetching user additional info (locale + profile)...');
          const response = await UserService.getUserAdditionalInfo();
          if (isCancelled) return;
          applyLocaleFromAdditionalInfoResponse(response, updateSettings, setLocaleLoaded);
          setAdditionalInfoData(response);
          setLocaleFetched(true);
        } catch (e) {
          console.error('Failed to fetch user additional info:', e);
          if (isCancelled) return;
          setLocaleLoaded(true);
          setLocaleFetched(true);
        } finally {
          if (!isCancelled) setIsLocaleLoading(false);
        }
      })();

      return () => { isCancelled = true; };
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      setIsLocaleLoading(false);
    };
  }, [isAuthenticated, localeFetched, updateSettings, setLocaleLoaded]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocaleFetched(false);
      setAdditionalInfoData(null);
      setIsLocaleLoading(false);
    }
  }, [isAuthenticated]);

  return {
    localeFetched,
    isLocaleLoading,
    localeLoaded,
    additionalInfoData,
  };
};

import {useState, useEffect, useRef} from 'react';
import {useTelegram} from '../useTelegram';
import {auth} from '../auth';
import type {LoginResponse} from '../api';

// Глобальный кэш для предотвращения множественных авторизаций
let globalAuthPromise: Promise<LoginResponse> | null = null;

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showNoTelegramError, setShowNoTelegramError] = useState(false);
  const [isTelegramChecked, setIsTelegramChecked] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const authPromiseRef = useRef<Promise<LoginResponse> | null>(null);

  const {initData, tgWebAppData} = useTelegram();

  // Шаг 1: Авторизация через Telegram при загрузке приложения
  useEffect(() => {
    if (initData !== undefined && tgWebAppData !== undefined) {
      if (initData && tgWebAppData) {
        // Используем глобальный кэш для предотвращения множественных авторизаций
        if (!globalAuthPromise) {
          console.log('[Auth] Starting new authentication...');
          globalAuthPromise = auth.loginWithTelegram(initData, tgWebAppData);
        } else {
          console.log('[Auth] Using cached authentication promise...');
        }
        
        authPromiseRef.current = globalAuthPromise;

        globalAuthPromise
        .then(() => {
          setAuthError(null);
          setIsAuthenticated(true);
          console.log('[Auth] Authentication successful');
        })
        .catch((e) => {
          setAuthError(e.message || 'Ошибка авторизации');
          setIsAuthenticated(false);
          globalAuthPromise = null; // Сбрасываем кэш при ошибке
          console.error('[Auth] Authentication failed:', e);
        });
        setShowNoTelegramError(false);
      } else {
        setShowNoTelegramError(true);
        setAuthError(null);
        setIsAuthenticated(false);
      }
      setIsTelegramChecked(true);
    }
  }, [initData, tgWebAppData]);

  // Шаг 2: Проверяем, есть ли уже сохраненные токены в localStorage
  useEffect(() => {
    if (isTelegramChecked && !showNoTelegramError && !authError) {
      const hasTokens = auth.isAuthenticated();
      setIsAuthenticated(hasTokens);
    }
  }, [isTelegramChecked, showNoTelegramError, authError]);

  return {
    isAuthenticated,
    showNoTelegramError,
    isTelegramChecked,
    authError,
    authPromise: authPromiseRef.current,
  };
};

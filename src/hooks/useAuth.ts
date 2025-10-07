import {useState, useEffect, useRef} from 'react';
import {useTelegram} from '../useTelegram';
import {auth} from '../auth';
import type {LoginResponse} from '../api';

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
        const authPromise = auth.loginWithTelegram(initData, tgWebAppData);
        authPromiseRef.current = authPromise;

        authPromise
        .then(() => {
          setAuthError(null);
          setIsAuthenticated(true);
        })
        .catch((e) => {
          setAuthError(e.message || 'Ошибка авторизации');
          setIsAuthenticated(false);
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

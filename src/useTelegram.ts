import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  initDataUnsafe?: {
    user?: TelegramUser;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp?: TelegramWebApp;
    };
  }
}

export function useTelegram() {
  const [user, setUser] = useState<TelegramUser | undefined>(undefined);
  const [initData, setInitData] = useState<string | undefined>(undefined);
  const [tgWebAppData, setTgWebAppData] = useState<any>(undefined);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      setInitData((window.Telegram.WebApp as any).initData);
      setTgWebAppData((window.Telegram.WebApp as any).initDataUnsafe);
      if (window.Telegram.WebApp.initDataUnsafe) {
        setUser(window.Telegram.WebApp.initDataUnsafe.user);
      }
    }
  }, []);

  return { user, initData, tgWebAppData };
} 
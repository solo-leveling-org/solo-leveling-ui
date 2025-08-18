import { useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

export function useTelegram() {
  const [user, setUser] = useState(WebApp.initDataUnsafe?.user);
  const [initData, setInitData] = useState(WebApp.initData);
  const [tgWebAppData, setTgWebAppData] = useState(WebApp.initDataUnsafe);

  useEffect(() => {
    // Уведомляем Telegram, что приложение готово
    WebApp.ready();
    
    // Устанавливаем начальные данные
    setUser(WebApp.initDataUnsafe?.user);
    setInitData(WebApp.initData);
    setTgWebAppData(WebApp.initDataUnsafe);
  }, []);

  return { 
    user, 
    initData, 
    tgWebAppData, 
    webApp: WebApp,
    isAvailable: true // WebApp всегда доступен при использовании SDK
  };
}

// Хук для работы с Telegram WebApp функциями
export function useTelegramWebApp() {
  const { webApp } = useTelegram();

  const showAlert = (message: string, callback?: () => void) => {
    try {
      webApp.showAlert(message, callback);
    } catch (error) {
      console.error('Error showing alert:', error);
      // Fallback для обычного браузера
      alert(message);
      if (callback) callback();
    }
  };

  const showConfirm = (message: string, callback: (confirmed: boolean) => void) => {
    try {
      webApp.showConfirm(message, callback);
    } catch (error) {
      console.error('Error showing confirm:', error);
      // Fallback для обычного браузера
      const confirmed = confirm(message);
      callback(confirmed);
    }
  };

  const showPopup = (params: {
    title: string;
    message: string;
    buttons: Array<{
      id?: string;
      type: 'default' | 'destructive';
      text: string;
    }>;
  }, callback: (buttonId: string | undefined) => void) => {
    try {
      webApp.showPopup(params, callback);
    } catch (error) {
      console.error('Error showing popup:', error);
      // Fallback для обычного браузера
      const buttonTexts = params.buttons.map(btn => btn.text).join(' | ');
      const result = prompt(`${params.title}\n\n${params.message}\n\nДоступные кнопки: ${buttonTexts}\nВведите ID кнопки:`);
      if (result) {
        callback(result);
      }
    }
  };



  const hapticFeedback = {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
      try {
        webApp.HapticFeedback.impactOccurred(style);
      } catch (error) {
        console.error('Error with haptic feedback:', error);
      }
    },
    notificationOccurred: (type: 'error' | 'success' | 'warning') => {
      try {
        webApp.HapticFeedback.notificationOccurred(type);
      } catch (error) {
        console.error('Error with haptic feedback:', error);
      }
    },
    selectionChanged: () => {
      try {
        webApp.HapticFeedback.selectionChanged();
      } catch (error) {
        console.error('Error with haptic feedback:', error);
      }
    }
  };

  const mainButton = {
    show: () => {
      try {
        webApp.MainButton.show();
      } catch (error) {
        console.error('Error showing main button:', error);
      }
    },
    hide: () => {
      try {
        webApp.MainButton.hide();
      } catch (error) {
        console.error('Error hiding main button:', error);
      }
    },
    setText: (text: string) => {
      try {
        webApp.MainButton.setText(text);
      } catch (error) {
        console.error('Error setting main button text:', error);
      }
    },
    onClick: (callback: () => void) => {
      try {
        webApp.MainButton.onClick(callback);
      } catch (error) {
        console.error('Error setting main button click:', error);
      }
    },
    showProgress: (leaveActive?: boolean) => {
      try {
        webApp.MainButton.showProgress(leaveActive);
      } catch (error) {
        console.error('Error showing main button progress:', error);
      }
    },
    hideProgress: () => {
      try {
        webApp.MainButton.hideProgress();
      } catch (error) {
        console.error('Error hiding main button progress:', error);
      }
    }
  };

  const backButton = {
    show: () => {
      try {
        webApp.BackButton.show();
      } catch (error) {
        console.error('Error showing back button:', error);
      }
    },
    hide: () => {
      try {
        webApp.BackButton.hide();
      } catch (error) {
        console.error('Error hiding back button:', error);
      }
    },
    onClick: (callback: () => void) => {
      try {
        webApp.BackButton.onClick(callback);
      } catch (error) {
        console.error('Error setting back button click:', error);
      }
    }
  };

  const cloudStorage = {
    getItem: async (key: string): Promise<string | null> => {
      try {
        // CloudStorage.getItem возвращает void, поэтому используем localStorage как fallback
        if (typeof window !== 'undefined' && window.localStorage) {
          return window.localStorage.getItem(key);
        }
        return null;
      } catch (error) {
        console.error('Error getting cloud storage item:', error);
        return null;
      }
    },
    setItem: async (key: string, value: string): Promise<void> => {
      try {
        webApp.CloudStorage.setItem(key, value);
      } catch (error) {
        console.error('Error setting cloud storage item:', error);
        // Fallback на localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.setItem(key, value);
        }
      }
    },
    removeItem: async (key: string): Promise<void> => {
      try {
        webApp.CloudStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing cloud storage item:', error);
        // Fallback на localStorage
        if (typeof window !== 'undefined' && window.localStorage) {
          window.localStorage.removeItem(key);
        }
      }
    },
    getKeys: async (): Promise<string[]> => {
      try {
        // CloudStorage.getKeys возвращает void, поэтому используем localStorage как fallback
        if (typeof window !== 'undefined' && window.localStorage) {
          return Object.keys(window.localStorage);
        }
        return [];
      } catch (error) {
        console.error('Error getting cloud storage keys:', error);
        return [];
      }
    }
  };

  return {
    webApp,
    isAvailable: true,
    showAlert,
    showConfirm,
    showPopup,
    hapticFeedback,
    mainButton,
    backButton,
    cloudStorage
  };
} 
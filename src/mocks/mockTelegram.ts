// Мок для Telegram WebApp SDK
import { mockTelegramUser, mockTelegramWebAppData } from './mockData';

export interface MockTelegramWebApp {
  initData: string;
  initDataUnsafe: any;
  version: string;
  platform: string;
  colorScheme: 'light' | 'dark';
  themeParams: any;
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  BackButton: any;
  MainButton: any;
  HapticFeedback: any;
  CloudStorage: any;
  ready: () => void;
  expand: () => void;
  close: () => void;
  enableClosingConfirmation: () => void;
  disableClosingConfirmation: () => void;
  enableVerticalSwipes: () => void;
  disableVerticalSwipes: () => void;
  showAlert: (message: string, callback?: () => void) => void;
  showConfirm: (message: string, callback: (confirmed: boolean) => void) => void;
  showPopup: (params: any, callback: (buttonId: string | undefined) => void) => void;
  openLink: (url: string, options?: any) => void;
  openTelegramLink: (url: string) => void;
  openInvoice: (url: string, callback?: (status: string) => void) => void;
  sendData: (data: string) => void;
  requestWriteAccess: (callback?: (granted: boolean) => void) => void;
  requestContact: (callback?: (granted: boolean) => void) => void;
}

// Создаем мок для MainButton
const createMockMainButton = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let text = '';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let isVisible = false;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let isProgressVisible = false;
  let onClickCallback: (() => void) | null = null;

  return {
    text: '',
    color: '#000000',
    textColor: '#ffffff',
    isVisible: false,
    isProgressVisible: false,
    isActive: true,
    setText: (newText: string) => {
      text = newText;
      console.log('[Mock Telegram] MainButton.setText:', newText);
    },
    onClick: (callback: () => void) => {
      onClickCallback = callback;
      console.log('[Mock Telegram] MainButton.onClick registered');
    },
    offClick: (callback: () => void) => {
      if (onClickCallback === callback) {
        onClickCallback = null;
      }
      console.log('[Mock Telegram] MainButton.offClick');
    },
    show: () => {
      isVisible = true;
      console.log('[Mock Telegram] MainButton.show');
    },
    hide: () => {
      isVisible = false;
      console.log('[Mock Telegram] MainButton.hide');
    },
    enable: () => {
      console.log('[Mock Telegram] MainButton.enable');
    },
    disable: () => {
      console.log('[Mock Telegram] MainButton.disable');
    },
    showProgress: (leaveActive?: boolean) => {
      isProgressVisible = true;
      console.log('[Mock Telegram] MainButton.showProgress', leaveActive);
    },
    hideProgress: () => {
      isProgressVisible = false;
      console.log('[Mock Telegram] MainButton.hideProgress');
    },
    setParams: (params: any) => {
      console.log('[Mock Telegram] MainButton.setParams', params);
    },
  };
};

// Создаем мок для BackButton
const createMockBackButton = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let isVisible = false;
  let onClickCallback: (() => void) | null = null;

  return {
    isVisible: false,
    onClick: (callback: () => void) => {
      onClickCallback = callback;
      console.log('[Mock Telegram] BackButton.onClick registered');
    },
    offClick: (callback: () => void) => {
      if (onClickCallback === callback) {
        onClickCallback = null;
      }
      console.log('[Mock Telegram] BackButton.offClick');
    },
    show: () => {
      isVisible = true;
      console.log('[Mock Telegram] BackButton.show');
    },
    hide: () => {
      isVisible = false;
      console.log('[Mock Telegram] BackButton.hide');
    },
  };
};

// Создаем мок для HapticFeedback
const createMockHapticFeedback = () => ({
  impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => {
    console.log('[Mock Telegram] HapticFeedback.impactOccurred:', style);
  },
  notificationOccurred: (type: 'error' | 'success' | 'warning') => {
    console.log('[Mock Telegram] HapticFeedback.notificationOccurred:', type);
  },
  selectionChanged: () => {
    console.log('[Mock Telegram] HapticFeedback.selectionChanged');
  },
});

// Создаем мок для CloudStorage
const createMockCloudStorage = () => {
  const storage: Record<string, string> = {};

  return {
    setItem: (key: string, value: string, callback?: (error: Error | null, success: boolean) => void) => {
      storage[key] = value;
      console.log('[Mock Telegram] CloudStorage.setItem:', key, value);
      if (callback) {
        callback(null, true);
      }
    },
    getItem: (key: string, callback?: (error: Error | null, value: string | null) => void) => {
      const value = storage[key] || null;
      console.log('[Mock Telegram] CloudStorage.getItem:', key, value);
      if (callback) {
        callback(null, value);
      }
    },
    getItems: (keys: string[], callback?: (error: Error | null, values: Record<string, string>) => void) => {
      const values: Record<string, string> = {};
      keys.forEach(key => {
        if (storage[key]) {
          values[key] = storage[key];
        }
      });
      console.log('[Mock Telegram] CloudStorage.getItems:', keys, values);
      if (callback) {
        callback(null, values);
      }
    },
    removeItem: (key: string, callback?: (error: Error | null, success: boolean) => void) => {
      delete storage[key];
      console.log('[Mock Telegram] CloudStorage.removeItem:', key);
      if (callback) {
        callback(null, true);
      }
    },
    removeItems: (keys: string[], callback?: (error: Error | null, success: boolean) => void) => {
      keys.forEach(key => delete storage[key]);
      console.log('[Mock Telegram] CloudStorage.removeItems:', keys);
      if (callback) {
        callback(null, true);
      }
    },
    getKeys: (callback?: (error: Error | null, keys: string[]) => void) => {
      const keys = Object.keys(storage);
      console.log('[Mock Telegram] CloudStorage.getKeys:', keys);
      if (callback) {
        callback(null, keys);
      }
    },
  };
};

// Создаем полный мок для Telegram WebApp
export const createMockTelegramWebApp = (): MockTelegramWebApp => {
  const mockInitData = `user=${JSON.stringify(mockTelegramUser)}&auth_date=${Math.floor(Date.now() / 1000)}&hash=mock_hash`;

  return {
    initData: mockInitData,
    initDataUnsafe: mockTelegramWebAppData,
    version: '8.0',
    platform: 'web',
    colorScheme: 'light',
    themeParams: {
      bg_color: '#ffffff',
      text_color: '#000000',
      hint_color: '#999999',
      link_color: '#2481cc',
      button_color: '#2481cc',
      button_text_color: '#ffffff',
    },
    isExpanded: true,
    viewportHeight: window.innerHeight,
    viewportStableHeight: window.innerHeight,
    headerColor: '#ffffff',
    backgroundColor: '#ffffff',
    BackButton: createMockBackButton(),
    MainButton: createMockMainButton(),
    HapticFeedback: createMockHapticFeedback(),
    CloudStorage: createMockCloudStorage(),
    ready: () => {
      console.log('[Mock Telegram] WebApp.ready()');
    },
    expand: () => {
      console.log('[Mock Telegram] WebApp.expand()');
    },
    close: () => {
      console.log('[Mock Telegram] WebApp.close()');
      // В реальном приложении это закроет мини-приложение
      // В моке просто логируем
    },
    enableClosingConfirmation: () => {
      console.log('[Mock Telegram] WebApp.enableClosingConfirmation()');
    },
    disableClosingConfirmation: () => {
      console.log('[Mock Telegram] WebApp.disableClosingConfirmation()');
    },
    enableVerticalSwipes: () => {
      console.log('[Mock Telegram] WebApp.enableVerticalSwipes()');
    },
    disableVerticalSwipes: () => {
      console.log('[Mock Telegram] WebApp.disableVerticalSwipes()');
    },
    showAlert: (message: string, callback?: () => void) => {
      console.log('[Mock Telegram] WebApp.showAlert:', message);
      window.alert(message);
      if (callback) callback();
    },
    showConfirm: (message: string, callback: (confirmed: boolean) => void) => {
      console.log('[Mock Telegram] WebApp.showConfirm:', message);
      const confirmed = window.confirm(message);
      callback(confirmed);
    },
    showPopup: (params: any, callback: (buttonId: string | undefined) => void) => {
      console.log('[Mock Telegram] WebApp.showPopup:', params);
      const buttonTexts = params.buttons.map((btn: any) => btn.text).join(' | ');
      const result = window.prompt(`${params.title}\n\n${params.message}\n\nДоступные кнопки: ${buttonTexts}\nВведите ID кнопки:`);
      if (result) {
        callback(result);
      } else {
        callback(undefined);
      }
    },
    openLink: (url: string, options?: any) => {
      console.log('[Mock Telegram] WebApp.openLink:', url, options);
      window.open(url, '_blank');
    },
    openTelegramLink: (url: string) => {
      console.log('[Mock Telegram] WebApp.openTelegramLink:', url);
      window.open(url, '_blank');
    },
    openInvoice: (url: string, callback?: (status: string) => void) => {
      console.log('[Mock Telegram] WebApp.openInvoice:', url);
      if (callback) callback('paid');
    },
    sendData: (data: string) => {
      console.log('[Mock Telegram] WebApp.sendData:', data);
    },
    requestWriteAccess: (callback?: (granted: boolean) => void) => {
      console.log('[Mock Telegram] WebApp.requestWriteAccess');
      if (callback) callback(true);
    },
    requestContact: (callback?: (granted: boolean) => void) => {
      console.log('[Mock Telegram] WebApp.requestContact');
      if (callback) callback(true);
    },
  };
};

// Устанавливаем мок в window для использования в useTelegram
export const setupMockTelegram = () => {
  if (typeof window !== 'undefined') {
    (window as any).Telegram = {
      WebApp: createMockTelegramWebApp(),
    };
    console.log('[Mock] Telegram WebApp initialized');
  }
};


export type Environment = 'development' | 'production';

export interface EnvironmentConfig {
  env: Environment;
  apiBaseUrl: string;
  wsUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
  useMocks: boolean;
}

// Проверяем, нужно ли использовать моки
const shouldUseMocks = (): boolean => {
  // Проверяем переменную окружения REACT_APP_USE_MOCKS
  const useMocksEnv = process.env.REACT_APP_USE_MOCKS;
  if (useMocksEnv === 'true' || useMocksEnv === '1') {
    return true;
  }
  if (useMocksEnv === 'false' || useMocksEnv === '0') {
    return false;
  }
  
  // В development режиме можно использовать моки, если Telegram недоступен
  // Но проверка будет выполнена позже, когда window доступен
  // По умолчанию в development не используем моки, если явно не указано
  return false;
};

const developmentConfig: EnvironmentConfig = {
  env: 'development',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || 'https://solo-leveling-gateway.ru.tuna.am',
  wsUrl: process.env.REACT_APP_WS_URL || 'wss://solo-leveling-gateway.ru.tuna.am/ws',
  isDevelopment: true,
  isProduction: false,
  useMocks: shouldUseMocks(),
};

const PROD_HOST = 'gateway.soloist-ai.com';

const productionConfig: EnvironmentConfig = {
  env: 'production',
  apiBaseUrl: process.env.REACT_APP_API_BASE_URL || `https://${PROD_HOST}`,
  wsUrl: process.env.REACT_APP_WS_URL || `wss://${PROD_HOST}/ws`,
  isDevelopment: false,
  isProduction: true,
  useMocks: false, // В production никогда не используем моки
};

// Определяем текущее окружение
const getCurrentEnvironment = (): Environment => {
  // Проверяем переменные окружения React
  const envFromProcess = process.env.REACT_APP_ENV as Environment;
  if (envFromProcess && (envFromProcess === 'development' || envFromProcess === 'production')) {
    return envFromProcess;
  }
  
  // Проверяем NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    return 'production';
  }
  
  // По умолчанию development
  return 'development';
};

const currentEnv = getCurrentEnvironment();

export const config: EnvironmentConfig = currentEnv === 'production' ? productionConfig : developmentConfig;

// Логируем конфигурацию для отладки и определяем моки динамически
if (typeof window !== 'undefined') {
  // В production никогда не переопределяем useMocks
  if (config.isProduction) {
    // В production всегда используем реальные API вызовы
    (config as any).useMocks = false;
  } else if (config.isDevelopment && !config.useMocks) {
    // Переопределяем useMocks, если Telegram недоступен в development
    // Проверяем наличие Telegram WebApp (может быть загружен позже)
    // Если Telegram недоступен, используем моки
    const checkTelegram = () => {
      const hasTelegram = !!(window as any).Telegram?.WebApp;
      if (!hasTelegram) {
        // Telegram недоступен, используем моки
        (config as any).useMocks = true;
        // Инициализируем моки синхронно
        const { setupMockTelegram } = require('../mocks/mockTelegram');
        setupMockTelegram();
      }
    };
    
    // Проверяем сразу
    checkTelegram();
    
    // Также проверяем через небольшую задержку на случай, если Telegram загружается асинхронно
    setTimeout(checkTelegram, 100);
  }
  
  // Если моки уже включены через переменную окружения, инициализируем их синхронно
  // Но лучше инициализировать в index.tsx до рендеринга React
}

// Экспортируем отдельные значения для удобства
export const { env, apiBaseUrl, wsUrl, isDevelopment, isProduction, useMocks } = config;

// Функция для получения конфигурации по имени окружения
export const getConfigByEnvironment = (environment: Environment): EnvironmentConfig => {
  return environment === 'production' ? productionConfig : developmentConfig;
};

// Функция для переключения окружения (для тестирования)
export const setEnvironment = (environment: Environment): void => {
  if (typeof window !== 'undefined') {
    (window as any).__REACT_APP_ENV__ = environment;
  }
};

// Функция для получения текущего окружения
export const getCurrentEnvironmentConfig = (): EnvironmentConfig => {
  if (typeof window !== 'undefined' && (window as any).__REACT_APP_ENV__) {
    const env = (window as any).__REACT_APP_ENV__;
    return env === 'production' ? productionConfig : developmentConfig;
  }
  return config;
};

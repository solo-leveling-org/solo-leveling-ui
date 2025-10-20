export type Environment = 'development' | 'production';

export interface EnvironmentConfig {
  env: Environment;
  apiBaseUrl: string;
  wsUrl: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const developmentConfig: EnvironmentConfig = {
  env: 'development',
  apiBaseUrl: 'https://solo-leveling-gateway.ru.tuna.am',
  wsUrl: 'wss://solo-leveling-gateway.ru.tuna.am/ws',
  isDevelopment: true,
  isProduction: false,
};

const productionConfig: EnvironmentConfig = {
  env: 'production',
  apiBaseUrl: 'https://gateway.solo-leveling.online',
  wsUrl: 'wss://gateway.solo-leveling.online/ws',
  isDevelopment: false,
  isProduction: true,
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

// Логируем конфигурацию для отладки
if (typeof window !== 'undefined') {
  console.log('[Config] Environment:', config.env);
  console.log('[Config] API URL:', config.apiBaseUrl);
  console.log('[Config] WebSocket URL:', config.wsUrl);
}

// Экспортируем отдельные значения для удобства
export const { env, apiBaseUrl, wsUrl, isDevelopment, isProduction } = config;

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

import type {LoginResponse, OpenAPIConfig, TgAuthData} from './api';
import {AuthService} from './api';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

// Глобальная переменная для отслеживания процесса обновления токена
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

function saveTokens(jwt: LoginResponse) {
  localStorage.setItem(ACCESS_TOKEN_KEY, jwt.accessToken.token);
  localStorage.setItem(REFRESH_TOKEN_KEY, jwt.refreshToken.token);
}

function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

async function loginWithTelegram(initData: string, tg_web_app_data: any): Promise<void> {
  const authData: TgAuthData = {
    init_data: initData,
    tg_web_app_data,
  };

  try {
    const jwt = await AuthService.login(authData);
    if (!jwt || !jwt.accessToken || !jwt.refreshToken || !jwt.accessToken.token || !jwt.refreshToken.token) {
      clearTokens();
      throw new Error('Не удалось получить токены авторизации от backend');
    }
    saveTokens(jwt);
  } catch (e: any) {
    throw e;
  }
}

async function refreshTokenIfNeeded(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const newToken = await AuthService.refresh({ refreshToken });
    localStorage.setItem(ACCESS_TOKEN_KEY, newToken.accessToken.token);
    return newToken.accessToken.token;
  } catch {
    clearTokens();
    return null;
  }
}

// Функция для обработки 401 ошибки
async function handle401Error(): Promise<string | null> {
  // Если уже идёт обновление токена, ждём его завершения
  if (isRefreshing && refreshPromise) {
    return await refreshPromise;
  }

  // Начинаем обновление токена
  isRefreshing = true;
  refreshPromise = refreshTokenIfNeeded();

  try {
    return await refreshPromise;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

// Функция для получения токена (используется в OpenAPI.TOKEN)
async function getTokenForRequest(config: OpenAPIConfig, options: any): Promise<string> {
  // Не отправляем токен для login и refresh запросов
  if (options.url === '/api/v1/auth/login' || options.url === '/api/v1/auth/refresh') {
    return '';
  }

  // Для всех остальных запросов отправляем токен
  let token = getAccessToken();
  if (!token) {
    token = await refreshTokenIfNeeded();
  }
  return token || '';
}

export const auth = {
  loginWithTelegram,
  getAccessToken,
  getRefreshToken,
  clearTokens,
  refreshTokenIfNeeded,
  handle401Error,
  getTokenForRequest,
};
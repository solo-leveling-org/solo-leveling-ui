/**
 * Утилиты для оптимизации производительности на мобильных устройствах
 */

/**
 * Получает WebApp объект из Telegram
 */
const getWebApp = () => {
  if (typeof window === 'undefined') return null;
  return (window as any).Telegram?.WebApp || null;
};

/**
 * Определяет, является ли устройство мобильным через Telegram WebApp API
 * Использует platform из Telegram WebApp, а не размер экрана
 */
export const isMobile = (): boolean => {
  const webApp = getWebApp();
  if (!webApp?.platform) {
    // Fallback: если Telegram WebApp недоступен, используем проверку размера экрана
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }
  
  const platform = webApp.platform;
  // Мобильные платформы: ios, android
  return platform === 'ios' || platform === 'android';
};

/**
 * Возвращает оптимизированное значение blur для backdrop-filter
 * На мобильных устройствах использует меньшее значение для лучшей производительности
 */
export const getOptimizedBlur = (desktopBlur: string = '20px', mobileBlur: string = '8px'): string => {
  return isMobile() ? mobileBlur : desktopBlur;
};

/**
 * Возвращает оптимизированное значение blur для CSS filter
 * На мобильных устройствах использует меньшее значение
 */
export const getOptimizedFilterBlur = (desktopBlur: string = '80px', mobileBlur: string = '40px'): string => {
  return isMobile() ? mobileBlur : desktopBlur;
};


import { useEffect } from 'react';
import { useTelegram } from '../useTelegram';

/**
 * Централизованный хук для управления адаптивностью Telegram Mini App
 * - Определяет тип устройства (mobile/desktop)
 * - Управляет полноэкранным режимом через web_app_request_fullscreen/web_app_exit_fullscreen
 * - Управляет CSS классами для адаптивных стилей
 * 
 * ВАЖНО: Используем новый API для управления полноэкранным режимом:
 * - web_app_request_fullscreen для мобильных устройств (iOS, Android)
 * - web_app_exit_fullscreen для desktop устройств
 * 
 * Эти события отправляются через postEvent() метод Telegram WebApp API.
 * Если postEvent недоступен, используется fallback через expand() для мобильных.
 */
export function useTelegramAdaptive() {
  const { webApp } = useTelegram();

  useEffect(() => {
    // Определяем платформу через Telegram WebApp API
    const tg = webApp || (window as any).Telegram?.WebApp;
    
    if (tg) {
      const platform = tg.platform;
      const isDesktop = platform === 'macos' || platform === 'windows' || platform === 'linux' || platform === 'web';
      const isMobile = platform === 'ios' || platform === 'android';
      
      if (isDesktop) {
        // Для desktop устройств
        document.body.classList.add('desktop-version');
        document.body.classList.remove('mobile-version');
        
        // Для desktop НЕ вызываем expand() - остается в fullsize (обычный режим)
        // Это работает только если в BotFather установлен режим "fullsize" по умолчанию
        // Если в BotFather установлен "fullscreen", то приложение уже будет в fullscreen,
        // и мы не сможем его программно свернуть (нет метода collapse в API)
      } else if (isMobile) {
        // Для mobile устройств (iOS и Android)
        document.body.classList.add('mobile-version');
        document.body.classList.remove('desktop-version');
        
        // Используем новый API для управления полноэкранным режимом
        // web_app_request_fullscreen для мобильных устройств
        const postEvent = (eventType: string, eventData?: any) => {
          try {
            if (typeof (tg as any).postEvent === 'function') {
              (tg as any).postEvent(eventType, eventData);
              console.log(`[Telegram Adaptive] postEvent called: ${eventType}`, eventData);
            } else if (typeof (window as any).Telegram?.WebApp?.postEvent === 'function') {
              (window as any).Telegram.WebApp.postEvent(eventType, eventData);
              console.log(`[Telegram Adaptive] postEvent called via window: ${eventType}`, eventData);
            } else {
              // Fallback: используем expand() если postEvent недоступен
              if (tg.expand && !tg.isExpanded) {
                tg.expand();
                console.log('[Telegram Adaptive] Fallback: expand() called');
              }
            }
          } catch (error) {
            console.warn(`[Telegram Adaptive] Failed to postEvent ${eventType}:`, error);
            // Fallback: используем expand()
            if (tg.expand && !tg.isExpanded) {
              try {
                tg.expand();
                console.log('[Telegram Adaptive] Fallback: expand() called after postEvent error');
              } catch (expandError) {
                console.warn('[Telegram Adaptive] Failed to expand:', expandError);
              }
            }
          }
        };
        
        // Дополнительные попытки запросить полноэкранный режим
        // Основной вызов происходит в useTelegram сразу после ready()
        // Здесь делаем fallback попытки
        if (!tg.isExpanded) {
          setTimeout(() => {
            if (!tg.isExpanded) {
              postEvent('web_app_request_fullscreen');
            }
          }, 500);
          
          setTimeout(() => {
            if (!tg.isExpanded) {
              postEvent('web_app_request_fullscreen');
            }
          }, 1000);
        }
      } else {
        // Для других платформ (fallback)
        document.body.classList.add('mobile-version');
        document.body.classList.remove('desktop-version');
      }
    } else {
      // Fallback для случаев когда Telegram WebApp недоступен
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        document.body.classList.add('mobile-version');
        document.body.classList.remove('desktop-version');
      } else {
        document.body.classList.add('desktop-version');
        document.body.classList.remove('mobile-version');
      }
    }
  }, [webApp]);
}

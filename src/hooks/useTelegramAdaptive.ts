import { useEffect } from 'react';
import { useTelegram } from '../useTelegram';

/**
 * Централизованный хук для управления адаптивностью Telegram Mini App
 * - Определяет тип устройства (mobile/desktop)
 * - Управляет полноэкранным режимом через web_app_request_fullscreen/web_app_expand
 * - Управляет CSS классами для адаптивных стилей
 * 
 * ВАЖНО: Используем новый API для управления полноэкранным режимом:
 * - web_app_request_fullscreen для мобильных устройств (iOS, Android)
 * - web_app_expand для desktop устройств (fullsize режим)
 * 
 * Методы вызываются согласно документации Telegram Mini Apps:
 * - Для web: window.parent.postMessage с JSON объектом
 * - Для desktop/mobile: window.TelegramWebviewProxy.postEvent
 * Если эти методы недоступны, используется fallback через SDK или expand().
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
        
        // Для desktop используем expand() для fullsize режима
        // Основной вызов происходит в useTelegram сразу после ready()
        // Здесь делаем fallback попытки
        if (!tg.isExpanded && tg.expand) {
          setTimeout(() => {
            if (!tg.isExpanded) {
              tg.expand();
              console.log('[Telegram Adaptive] expand() called for desktop (fallback)');
            }
          }, 500);
        }
      } else if (isMobile) {
        // Для mobile устройств (iOS и Android)
        document.body.classList.add('mobile-version');
        document.body.classList.remove('desktop-version');
        
        // Используем новый API для управления полноэкранным режимом
        // web_app_request_fullscreen для мобильных устройств
        // Согласно документации: https://docs.telegram-mini-apps.com/platform/methods#web_app_request_fullscreen
        const postEvent = (eventType: string, eventData?: any) => {
          try {
            // Для web версии используем window.parent.postMessage
            if (platform === 'web') {
              const message = JSON.stringify({
                eventType: eventType,
                eventData: eventData || {}
              });
              window.parent.postMessage(message, 'https://web.telegram.org');
              console.log(`[Telegram Adaptive] postMessage (web): ${eventType}`, eventData);
            }
            // Для desktop и mobile используем TelegramWebviewProxy.postEvent
            else if (typeof (window as any).TelegramWebviewProxy?.postEvent === 'function') {
              const data = eventData ? JSON.stringify(eventData) : '';
              (window as any).TelegramWebviewProxy.postEvent(eventType, data);
              console.log(`[Telegram Adaptive] postEvent (native): ${eventType}`, eventData);
            }
            // Fallback: пробуем через SDK postEvent
            else if (typeof (tg as any).postEvent === 'function') {
              (tg as any).postEvent(eventType, eventData);
              console.log(`[Telegram Adaptive] postEvent (SDK): ${eventType}`, eventData);
            } else if (typeof (window as any).Telegram?.WebApp?.postEvent === 'function') {
              (window as any).Telegram.WebApp.postEvent(eventType, eventData);
              console.log(`[Telegram Adaptive] postEvent (window): ${eventType}`, eventData);
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

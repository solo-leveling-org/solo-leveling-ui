import { useEffect } from 'react';
import { useTelegram } from '../useTelegram';

/**
 * Централизованный хук для управления адаптивностью Telegram Mini App
 * - Определяет тип устройства (mobile/desktop)
 * - Управляет полноэкранным режимом через web_app_request_fullscreen/web_app_expand
 * - Управляет CSS классами для адаптивных стилей
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
        document.body.classList.add('desktop-version');
        document.body.classList.remove('mobile-version');
        
        if (!tg.isExpanded && tg.expand) {
          setTimeout(() => {
            if (!tg.isExpanded) {
              tg.expand();
            }
          }, 500);
        }
      } else if (isMobile) {
        document.body.classList.add('mobile-version');
        document.body.classList.remove('desktop-version');
        
        const postEvent = (eventType: string, eventData?: any) => {
          try {
            if (platform === 'web') {
              const message = JSON.stringify({
                eventType: eventType,
                eventData: eventData || {}
              });
              window.parent.postMessage(message, 'https://web.telegram.org');
            } else if (typeof (window as any).TelegramWebviewProxy?.postEvent === 'function') {
              const data = eventData ? JSON.stringify(eventData) : '';
              (window as any).TelegramWebviewProxy.postEvent(eventType, data);
            } else if (typeof (tg as any).postEvent === 'function') {
              (tg as any).postEvent(eventType, eventData);
            } else if (typeof (window as any).Telegram?.WebApp?.postEvent === 'function') {
              (window as any).Telegram.WebApp.postEvent(eventType, eventData);
            } else if (tg.expand && !tg.isExpanded) {
              tg.expand();
            }
          } catch (error) {
            if (tg.expand && !tg.isExpanded) {
              try {
                tg.expand();
              } catch (expandError) {
                // Silent fail
              }
            }
          }
        };
        
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
        document.body.classList.add('mobile-version');
        document.body.classList.remove('desktop-version');
      }
    } else {
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

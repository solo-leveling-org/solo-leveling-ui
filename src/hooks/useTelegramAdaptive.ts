import { useEffect } from 'react';
import { useTelegram } from '../useTelegram';

/**
 * Централизованный хук для управления адаптивностью Telegram Mini App
 * - Определяет тип устройства (mobile/desktop)
 * - Управляет полноэкранным режимом (expand только для mobile)
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
      
      if (isDesktop) {
        // Для desktop устройств
        document.body.classList.add('desktop-version');
        document.body.classList.remove('mobile-version');
        
        // Для desktop НЕ вызываем expand() - это предотвращает полноэкранный режим
        // Если приложение уже в полноэкранном режиме по умолчанию, мы не можем программно его свернуть,
        // но не вызывая expand() мы гарантируем, что оно не перейдет в полноэкранный режим
        // если еще не перешло, или останется в обычном режиме
        
        // ready() уже вызывается в useTelegram, поэтому здесь не вызываем
      } else {
        // Для mobile устройств
        document.body.classList.add('mobile-version');
        document.body.classList.remove('desktop-version');
        
        // Включаем полноэкранный режим для mobile
        // ready() уже вызывается в useTelegram, поэтому здесь только expand()
        if (tg.expand) {
          if (!tg.isExpanded) {
            if (tg.expand && !tg.isExpanded) {
              tg.expand();
            }
          }
        }
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


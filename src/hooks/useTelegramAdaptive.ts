import { useEffect } from 'react';
import { useTelegram } from '../useTelegram';

/**
 * Централизованный хук для управления адаптивностью Telegram Mini App
 * - Определяет тип устройства (mobile/desktop)
 * - Управляет полноэкранным режимом (expand только для mobile)
 * - Управляет CSS классами для адаптивных стилей
 * 
 * ВАЖНО: В BotFather должен быть установлен режим "fullsize" (обычный режим) по умолчанию.
 * Это позволяет программно управлять режимом:
 * - Для mobile: вызываем expand() чтобы развернуть в fullscreen
 * - Для desktop: НЕ вызываем expand(), остается в fullsize (обычный режим)
 * 
 * Если в BotFather установлен "fullscreen", то приложение всегда будет в fullscreen,
 * и мы не сможем программно его свернуть (нет метода collapse в API).
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
        
        // Для desktop НЕ вызываем expand() - остается в fullsize (обычный режим)
        // Это работает только если в BotFather установлен режим "fullsize" по умолчанию
        // Если в BotFather установлен "fullscreen", то приложение уже будет в fullscreen,
        // и мы не сможем его программно свернуть (нет метода collapse в API)
        
        // ready() уже вызывается в useTelegram, поэтому здесь не вызываем
      } else {
        // Для mobile устройств
        document.body.classList.add('mobile-version');
        document.body.classList.remove('desktop-version');
        
        // Включаем полноэкранный режим для mobile через expand()
        // Это работает только если в BotFather установлен режим "fullsize" по умолчанию
        // Если уже в fullscreen (isExpanded = true), то expand() не нужен
        if (tg.expand && !tg.isExpanded) {
          // Небольшая задержка для гарантии, что ready() из useTelegram выполнился
          setTimeout(() => {
            if (tg.expand && !tg.isExpanded) {
              tg.expand();
            }
          }, 100);
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

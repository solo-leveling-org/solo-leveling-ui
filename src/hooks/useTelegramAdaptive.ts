import { useEffect, useRef } from 'react';
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
 * 
 * Best Practice: expand() должен вызываться сразу после ready() для мобильных устройств.
 * expand() работает только на iOS и Android платформах.
 */
export function useTelegramAdaptive() {
  const { webApp } = useTelegram();
  const expandAttemptedRef = useRef(false);

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
        
        // Включаем полноэкранный режим для mobile через expand()
        // Best practice: expand() должен вызываться сразу после ready()
        // Основной вызов expand() происходит в useTelegram сразу после ready()
        // Здесь делаем дополнительные попытки на случай, если основной вызов не сработал
        
        const tryExpand = () => {
          // Проверяем, что expand доступен и приложение еще не развернуто
          if (!tg.expand || typeof tg.expand !== 'function') {
            return false;
          }
          
          if (tg.isExpanded) {
            console.log('[Telegram Adaptive] Already in fullscreen mode');
            return true;
          }
          
          try {
            // Вызываем expand() для перехода в fullscreen
            tg.expand();
            console.log('[Telegram Adaptive] expand() called for mobile (fallback attempt)');
            expandAttemptedRef.current = true;
            return true;
          } catch (error) {
            console.warn('[Telegram Adaptive] Failed to expand:', error);
            return false;
          }
        };
        
        // Используем событие viewportChanged если доступно (более надежный способ)
        // Это событие срабатывает после того, как viewport стабилизировался после ready()
        if (tg.onEvent && typeof tg.onEvent === 'function') {
          tg.onEvent('viewportChanged', () => {
            if (!expandAttemptedRef.current && !tg.isExpanded) {
              console.log('[Telegram Adaptive] viewportChanged event - trying expand');
              tryExpand();
            }
          });
        }
        
        // Дополнительные попытки expand() на случай, если основной вызов в useTelegram не сработал
        // Основной вызов происходит в useTelegram сразу после ready()
        // Здесь делаем fallback попытки
        if (!tg.isExpanded) {
          setTimeout(() => {
            if (!tg.isExpanded) {
              tryExpand();
            }
          }, 500);
          
          setTimeout(() => {
            if (!tg.isExpanded) {
              tryExpand();
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

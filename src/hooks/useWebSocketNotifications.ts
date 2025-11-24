import { useEffect, useRef } from 'react';
import type { LoginResponse } from '../api';
import { useNotification } from '../components/NotificationSystem';
import { useSettings } from './useSettings';
import { fetchAndUpdateUserLocale } from '../utils/localeUtils';
import { useMocks } from '../config/environment';
import { websocketManager } from '../services/websocketManager';

interface UseWebSocketNotificationsProps {
  enabled: boolean;
  authPromise?: Promise<LoginResponse> | null;
}

export function useWebSocketNotifications({ enabled, authPromise }: UseWebSocketNotificationsProps) {
  const { show } = useNotification();
  const { updateSettings } = useSettings();
  const isMockMode = useMocks;
  const handlersRegisteredRef = useRef(false);

  useEffect(() => {
    // В мок режиме слушаем события mock-notification вместо WebSocket
    if (isMockMode) {
      console.log('[WS] Mock mode: WebSocket disabled, listening to mock-notification events');
      
      const handleMockNotification = (event: CustomEvent) => {
        try {
          const body = event.detail;
          const notification = body.payload;

          // Если visible = true, показываем уведомление пользователю
          if (notification.visible && notification.message) {
            show({
              message: notification.message,
              type: notification.type?.toLowerCase() || 'info',
              duration: 3000,
            });
          }

          // Обрабатываем действия в зависимости от source
          if (notification.source === 'TASKS' || notification.source === 'tasks') {
            // Отправляем кастомное событие для уведомлений с source = 'tasks'
            const tasksEvent = new CustomEvent('tasks-notification', {
              detail: { source: 'tasks' }
            });
            window.dispatchEvent(tasksEvent);
          }
        } catch (e) {
          console.warn('[WS][Mock Notification] Failed to parse message', e, event.detail);
        }
      };

      window.addEventListener('mock-notification', handleMockNotification as EventListener);

      return () => {
        window.removeEventListener('mock-notification', handleMockNotification as EventListener);
      };
    }

    // Функция для обработки обновления локализации
    const handleLocaleUpdate = async () => {
      try {
        await fetchAndUpdateUserLocale(updateSettings);
        console.log('[WS][Locale] Updated locale from server via WebSocket notification');
      } catch (error) {
        console.error('[WS][Locale] Failed to update locale:', error);
      }
    };

    // Регистрируем обработчики уведомлений (только один раз)
    if (!handlersRegisteredRef.current) {
      // Обработчик уведомлений
      const removeNotificationHandler = websocketManager.addNotificationHandler((notification) => {
        // Если visible = true, показываем уведомление пользователю
        if (notification.visible && notification.message) {
          show({
            message: notification.message,
            type: notification.type,
            duration: 3000,
          });
        }

        // Обрабатываем действия в зависимости от source
        switch (notification.source) {
          case 'tasks':
            // Отправляем кастомное событие для уведомлений с source = 'tasks'
            const event = new CustomEvent('tasks-notification', {
              detail: { source: notification.source }
            });
            window.dispatchEvent(event);
            break;

          default:
            // locale обрабатывается отдельным обработчиком
            break;
        }
      });

      // Обработчик обновления локализации
      const removeLocaleHandler = websocketManager.addLocaleUpdateHandler(handleLocaleUpdate);

      handlersRegisteredRef.current = true;

      // Очистка обработчиков при размонтировании
      return () => {
        removeNotificationHandler();
        removeLocaleHandler();
        handlersRegisteredRef.current = false;
      };
    }
  }, [show, updateSettings, isMockMode]);

  // Отдельный эффект для управления подключением
  useEffect(() => {
    if (isMockMode) {
      return;
    }

    if (!enabled) {
      // Отключаем WebSocket если не авторизован
      websocketManager.disable();
      return;
    }

    // Если есть промис авторизации, ждем его завершения перед включением менеджера
    if (authPromise) {
      authPromise
        .then(() => {
          // После успешной авторизации включаем менеджер
          // Менеджер сам получит токен из localStorage через auth.getAccessToken()
          websocketManager.enable();
        })
        .catch((error) => {
          console.error('[WS] Authentication failed:', error);
          websocketManager.disable();
        });
    } else {
      // Если промиса нет, но enabled = true, значит пользователь уже авторизован
      // Включаем менеджер, он сам получит токен из localStorage
      websocketManager.enable();
    }

    return () => {
      // Не отключаем менеджер при размонтировании компонента,
      // так как он может использоваться другими компонентами
      // Менеджер будет отключен только если enabled станет false
    };
  }, [enabled, authPromise, isMockMode]);
}
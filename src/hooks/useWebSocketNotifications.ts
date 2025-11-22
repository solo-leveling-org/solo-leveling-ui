import { useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { OpenAPI } from '../api';
import type { Message, LoginResponse } from '../api';
import { useNotification } from '../components/NotificationSystem';
import { useSettings } from './useSettings';
import { fetchAndUpdateUserLocale } from '../utils/localeUtils';
import { useMocks } from '../config/environment';

interface UseWebSocketNotificationsProps {
  enabled: boolean;
  authPromise?: Promise<LoginResponse> | null;
}

export function useWebSocketNotifications({ enabled, authPromise }: UseWebSocketNotificationsProps) {
  const clientRef = useRef<Client | null>(null);
  const { show } = useNotification();
  const { updateSettings } = useSettings();
  const isMockMode = useMocks;

  useEffect(() => {
    // В мок режиме не подключаемся к WebSocket
    if (isMockMode) {
      console.log('[WS] Mock mode: WebSocket disabled');
      return;
    }

    if (!enabled) {
      // Отключаем WebSocket если не авторизован
      if (clientRef.current) {
        try {
          clientRef.current.deactivate();
        } catch (e) {
          console.warn('[WS] error during deactivate', e);
        }
        clientRef.current = null;
      }
      return;
    }

    // Проверяем, что WebSocket еще не подключен
    if (clientRef.current && clientRef.current.connected) {
      console.log('[WS] Already connected, skipping');
      return;
    }

    // Если есть промис авторизации, ждем его завершения и подключаемся к WebSocket
    if (authPromise) {
      authPromise
        .then((response) => {
          const token = response?.accessToken?.token;
          if (token && !clientRef.current?.connected) {
            connectWebSocket(token);
          }
        })
        .catch((error) => {
          console.error('[WS] Authentication failed:', error);
        });
    } else {
      // Если промиса нет, но enabled = true, значит пользователь уже авторизован
      // Получаем токен из localStorage
      const token = localStorage.getItem('accessToken');
      if (token && !clientRef.current?.connected) {
        connectWebSocket(token);
      }
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

    function connectWebSocket(token: string) {
      if (!token) {
        return;
      }

      // Проверяем, что WebSocket еще не подключен
      if (clientRef.current && clientRef.current.connected) {
        console.log('[WS] Already connected, skipping connection');
        return;
      }

      const base = OpenAPI.BASE || '';
      const url = new URL(base);
      const isSecure = url.protocol === 'https:';
      const wsProtocol = isSecure ? 'wss:' : 'ws:';
      const brokerURL = `${wsProtocol}//${url.host}/ws?token=${encodeURIComponent(token)}`;

      const client = new Client({
        brokerURL,
        reconnectDelay: 5000,
        heartbeatIncoming: 10000,
        heartbeatOutgoing: 10000,
        onConnect: () => {
          console.log('[WS] Connected successfully');
          client.subscribe(`/user/queue/notifications`, (message: IMessage) => {
            try {
              const body: Message = JSON.parse(message.body);
              const notification = body.payload;

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

                case 'locale':
                  // Получаем текущую локализацию пользователя и обновляем UI
                  handleLocaleUpdate();
                  break;

                default:
                  console.log('[WS][Notification] Unknown source:', notification.source);
              }
            } catch (e) {
              console.warn('[WS][Notification] Failed to parse message', e, message.body);
            }
          });
        },
        onStompError: (frame: any) => {
          console.error('[WS][STOMP ERROR]', frame.headers['message'], frame.body);
        },
        onWebSocketError: (event: Event) => {
          console.error('[WS][SOCKET ERROR]', event);
        },
        onWebSocketClose: (event: CloseEvent) => {
          console.warn('[WS][CLOSED]', event.code, event.reason);
        },
      });

      clientRef.current = client;
      client.activate();
    }

    return () => {
      try {
        if (clientRef.current) {
          clientRef.current.deactivate();
        }
      } catch (e) {
        console.warn('[WS] error during deactivate', e);
      }
      clientRef.current = null;
    };
  }, [enabled, authPromise, show, updateSettings, isMockMode]);
}
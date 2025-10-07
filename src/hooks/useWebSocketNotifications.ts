import { useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { OpenAPI } from '../api';
import type { Message, LoginResponse } from '../api';
import { useNotification } from '../components/NotificationSystem';

interface UseWebSocketNotificationsProps {
  enabled: boolean;
  authPromise?: Promise<LoginResponse> | null;
}

export function useWebSocketNotifications({ enabled, authPromise }: UseWebSocketNotificationsProps) {
  const clientRef = useRef<Client | null>(null);
  const { show } = useNotification();

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Если есть промис авторизации, ждем его завершения и подключаемся к WebSocket
    if (authPromise) {
      authPromise
        .then((response) => {
          const token = response?.accessToken?.token;
          if (token) {
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
      if (token) {
        connectWebSocket(token);
      }
    }

    function connectWebSocket(token: string) {
      if (!token) {
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

              show({
                message: body.payload.message,
                type: body.payload.type,
                duration: 3000,
              });

              // Отправляем кастомное событие для уведомлений с source = 'tasks'
              if (body.payload.source === 'tasks') {
                const event = new CustomEvent('tasks-notification', {
                  detail: { source: body.payload.source }
                });
                window.dispatchEvent(event);
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
  }, [enabled, authPromise, show]);
}
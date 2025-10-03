import {useEffect, useRef} from 'react';
import {Client, IMessage} from '@stomp/stompjs';
import {OpenAPI} from '../api';
import {auth} from '../auth';
import type {Message} from '../api';

function getUserIdFromToken(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.sub;
  } catch (e) {
    console.warn('Failed to decode token, using default user');
    return 'default-user';
  }
}

export function useWebSocketNotifications(enabled: boolean) {
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const token = auth.getAccessToken();
    if (!token) {
      return;
    }

    const userId = getUserIdFromToken(token);
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
        client.subscribe(`/user/${userId}/queue/notifications`, (message: IMessage) => {
          try {
            const body: Message = JSON.parse(message.body);
            console.log('[WS][Notification]', body);
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

    return () => {
      try {
        client.deactivate();
      } catch (e) {
        console.warn('[WS] error during deactivate', e);
      }
      clientRef.current = null;
    };
  }, [enabled]);
}
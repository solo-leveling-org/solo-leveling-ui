import { useEffect, useRef } from 'react';
import { Client, IMessage } from '@stomp/stompjs';
import { OpenAPI } from '../api';
import { auth } from '../auth';
import type { Message } from '../api';

// Simple hook that connects to WS after auth and subscribes to notifications
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
      debug: (str: string) => {
        // Uncomment if you want verbose logs
        // console.debug('[WS]', str);
      },
      onConnect: () => {
        // Subscribe to user notifications
        client.subscribe('/queue/user-notifications', (message: IMessage) => {
          try {
            const body: Message = JSON.parse(message.body);
            // For now, just log to verify delivery in DevTools
            // eslint-disable-next-line no-console
            console.log('[WS][Notification]', body);
          } catch (e) {
            // eslint-disable-next-line no-console
            console.warn('[WS][Notification] Failed to parse message', e, message.body);
          }
        });
      },
      onStompError: (frame: any) => {
        // eslint-disable-next-line no-console
        console.error('[WS][STOMP ERROR]', frame.headers['message'], frame.body);
      },
      onWebSocketError: (event: Event) => {
        // eslint-disable-next-line no-console
        console.error('[WS][SOCKET ERROR]', event);
      },
      onWebSocketClose: (event: CloseEvent) => {
        // eslint-disable-next-line no-console
        console.warn('[WS][CLOSED]', event.code, event.reason);
      },
    });

    clientRef.current = client;
    client.activate();

    return () => {
      try {
        client.deactivate();
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn('[WS] error during deactivate', e);
      }
      clientRef.current = null;
    };
  }, [enabled]);
}



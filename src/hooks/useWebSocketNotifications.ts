import {useEffect, useRef} from 'react';
import {Client, IMessage} from '@stomp/stompjs';
import {OpenAPI} from '../api';
import { useNotifications } from '../components/ui/Notifications';
import {auth} from '../auth';
import type {Message} from '../api';

export function useWebSocketNotifications(enabled: boolean) {
  const clientRef = useRef<Client | null>(null);
  const { notify } = useNotifications();

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
      onConnect: () => {
        client.subscribe(`/user/queue/notifications`, (message: IMessage) => {
          try {
            const body: Message = JSON.parse(message.body);
            notify(body.payload.message, body.payload.type);
          } catch (e) {
            console.error('[WS][Notification] Failed to parse message', e);
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
  }, [enabled, notify]);
}
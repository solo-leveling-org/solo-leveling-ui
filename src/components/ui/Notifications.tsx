import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { NotificationType } from '../../api';

type Toast = {
  id: string;
  message: string;
  type: NotificationType;
};

type NotificationsContextValue = {
  notify: (message: string, type: NotificationType) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Record<string, any>>({});

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    const t = timeoutsRef.current[id];
    if (t) {
      clearTimeout(t);
      delete timeoutsRef.current[id];
    }
  }, []);

  const notify = useCallback((message: string, type: NotificationType) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts(prev => [{ id, message, type }, ...prev]);
    timeoutsRef.current[id] = setTimeout(() => remove(id), 4000);
  }, [remove]);

  const value = useMemo(() => ({ notify }), [notify]);

  useEffect(() => () => {
    Object.values(timeoutsRef.current).forEach(clearTimeout);
    timeoutsRef.current = {};
  }, []);

  const getStyle = (type: NotificationType) => {
    switch (type) {
      case NotificationType.INFO:
        return {
          ring: 'ring-blue-300/40',
          bg: 'bg-white/90',
          text: 'text-blue-800',
          title: 'bg-blue-600',
          icon: (
            <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 3a9 9 0 110 18 9 9 0 010-18z" />
            </svg>
          )
        };
      case NotificationType.WARNING:
        return {
          ring: 'ring-amber-300/40',
          bg: 'bg-white/90',
          text: 'text-amber-900',
          title: 'bg-amber-500',
          icon: (
            <svg className="w-5 h-5 text-amber-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          )
        };
      case NotificationType.ERROR:
      default:
        return {
          ring: 'ring-rose-300/40',
          bg: 'bg-white/90',
          text: 'text-rose-900',
          title: 'bg-rose-500',
          icon: (
            <svg className="w-5 h-5 text-rose-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )
        };
    }
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
      {/* Toasts Container */}
      <div className="fixed top-4 right-4 z-[2000] flex flex-col items-end gap-3 pointer-events-none">
        {toasts.map((t) => {
          const s = getStyle(t.type);
          return (
            <div
              key={t.id}
              role="status"
              aria-live="polite"
              className={`pointer-events-auto relative w-80 max-w-[90vw] rounded-2xl shadow-xl border border-white/30 ${s.bg} backdrop-blur-xl ring-1 ${s.ring} animate-dialog-content`}
            >
              <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-white/10 to-transparent -z-10" />
              <div className="flex items-start p-4">
                <div className="mr-3 mt-0.5">{s.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-white ${s.title} mb-1`}> 
                    {t.type === NotificationType.INFO ? 'Info' : t.type === NotificationType.WARNING ? 'Warning' : 'Error'}
                  </div>
                  <p className={`text-sm ${s.text}`}>{t.message}</p>
                </div>
                <button
                  onClick={() => remove(t.id)}
                  className="ml-3 inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/60 hover:bg-white transition-colors"
                  aria-label="Close notification"
                >
                  <svg className="w-4 h-4 text-gray-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </NotificationsContext.Provider>
  );
};

export const useNotifications = (): NotificationsContextValue => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
};



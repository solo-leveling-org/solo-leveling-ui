import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  duration?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Компонент отдельного уведомления
const NotificationItem: React.FC<{
  notification: Notification;
  onRemove: (id: string) => void;
}> = ({ notification, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = useCallback(() => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove(notification.id);
    }, 300); // Время для анимации исчезновения
  }, [notification.id, onRemove]);

  useEffect(() => {
    // Анимация появления
    const timer = setTimeout(() => setIsVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (notification.duration && notification.duration > 0) {
      const timer = setTimeout(() => {
        handleRemove();
      }, notification.duration);
      return () => clearTimeout(timer);
    }
  }, [notification.duration, handleRemove]);

  const getNotificationStyles = () => {
    const baseStyles = "relative overflow-hidden rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 ease-out transform";
    
    switch (notification.type) {
      case 'success':
        return `${baseStyles} bg-gradient-to-r from-emerald-50 to-green-50 border-emerald-200/50 shadow-emerald-100/50`;
      case 'info':
        return `${baseStyles} bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200/50 shadow-blue-100/50`;
      case 'warning':
        return `${baseStyles} bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200/50 shadow-amber-100/50`;
      case 'error':
        return `${baseStyles} bg-gradient-to-r from-red-50 to-rose-50 border-red-200/50 shadow-red-100/50`;
      default:
        return `${baseStyles} bg-white/80 border-gray-200/50 shadow-gray-100/50`;
    }
  };

  const getIcon = () => {
    const iconClass = "w-5 h-5 flex-shrink-0";
    
    switch (notification.type) {
      case 'success':
        return (
          <svg className={`${iconClass} text-emerald-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'info':
        return (
          <svg className={`${iconClass} text-blue-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'warning':
        return (
          <svg className={`${iconClass} text-amber-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        );
      case 'error':
        return (
          <svg className={`${iconClass} text-red-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      default:
        return (
          <svg className={`${iconClass} text-gray-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-emerald-800';
      case 'info':
        return 'text-blue-800';
      case 'warning':
        return 'text-amber-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-gray-800';
    }
  };

  return (
    <div
      className={`
        ${getNotificationStyles()}
        ${isVisible && !isRemoving ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'}
        ${isRemoving ? 'translate-x-full opacity-0 scale-95' : ''}
        max-w-sm w-full
      `}
      style={{
        transform: isVisible && !isRemoving ? 'translateX(0)' : 'translateX(100%)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {/* Прогресс-бар для автоматического закрытия */}
      {notification.duration && notification.duration > 0 && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-black/10 rounded-t-2xl overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-t-2xl animate-progress"
            style={{
              animation: `progress ${notification.duration}ms linear forwards`,
            }}
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${getTextColor()} leading-relaxed`}>
              {notification.message}
            </p>
          </div>
          
          <button
            onClick={handleRemove}
            className="flex-shrink-0 p-1 rounded-full hover:bg-black/5 transition-colors duration-200 group"
            aria-label="Закрыть уведомление"
          >
            <svg className="w-4 h-4 text-gray-500 group-hover:text-gray-700 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

// Контейнер для уведомлений
export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification.id} className="pointer-events-auto">
          <NotificationItem
            notification={notification}
            onRemove={removeNotification}
          />
        </div>
      ))}
    </div>
  );
};

// Провайдер контекста
export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration ?? 5000, // По умолчанию 5 секунд
    };
    
    setNotifications(prev => [...prev, newNotification]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider value={{
      notifications,
      addNotification,
      removeNotification,
      clearAll,
    }}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// Хук для показа уведомлений
export const useNotification = () => {
  const { addNotification } = useNotifications();
  
  return {
    show: addNotification,
    success: (message: string, duration?: number) => 
      addNotification({ message, type: 'success', duration }),
    info: (message: string, duration?: number) => 
      addNotification({ message, type: 'info', duration }),
    warning: (message: string, duration?: number) => 
      addNotification({ message, type: 'warning', duration }),
    error: (message: string, duration?: number) => 
      addNotification({ message, type: 'error', duration }),
  };
};

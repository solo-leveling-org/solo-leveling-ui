// src/utils/notifications.ts
import { toast, ToastOptions } from 'react-toastify';
import { ReactElement } from 'react';

// Типы уведомлений — совпадает с твоим NotificationType
export interface Notification {
  message: string;
  type: 'info' | 'warning' | 'error';
}

// Кастомные компоненты для каждого типа
const InfoToast = ({ message }: { message: string }) => (
    <div className="flex items-start gap-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-lg shadow-sm max-w-[90vw] sm:max-w-md">
    <div className="text-blue-600 text-xl">ℹ️</div>
        <div className="flex-1">
<p className="text-sm font-medium text-blue-800">{message}</p>
    </div>
    </div>
);

const WarningToast = ({ message }: { message: string }) => (
    <div className="flex items-start gap-3 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg shadow-sm max-w-[90vw] sm:max-w-md">
    <div className="text-yellow-600 text-xl">⚠️</div>
<div className="flex-1">
<p className="text-sm font-medium text-yellow-800">{message}</p>
    </div>
    </div>
);

const ErrorToast = ({ message }: { message: string }) => (
    <div className="flex items-start gap-3 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg shadow-sm max-w-[90vw] sm:max-w-md">
    <div className="text-red-600 text-xl">❌</div>
<div className="flex-1">
<p className="text-sm font-medium text-red-800">{message}</p>
    </div>
    </div>
);

// Общие настройки тоста
const DEFAULT_TOAST_OPTIONS: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'light', // не используем 'colored', потому что кастомизируем сами
  className: 'p-0 m-2', // убираем внутренние отступы — управляем через компонент
};

export const showNotification = (notification: Notification) => {
  const { message, type } = notification;

  let ToastComponent: ReactElement;

  switch (type) {
    case 'info':
      ToastComponent = <InfoToast message={message} />;
      break;
    case 'warning':
      ToastComponent = <WarningToast message={message} />;
      break;
    case 'error':
      ToastComponent = <ErrorToast message={message} />;
      break;
    default:
      ToastComponent = <div className="p-4 text-gray-700">{message}</div>;
  }

  toast(ToastComponent, DEFAULT_TOAST_OPTIONS);
};
import { toast, ToastOptions } from 'react-toastify';

const DEFAULT_TOAST_OPTIONS: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: 'colored', // или 'light' / 'dark' — 'colored' даёт цвета по типу
};

export interface Notification {
  message: string;
  type: 'info' | 'warning' | 'error';
}

export const showNotification = (notification: Notification) => {
  const { message, type } = notification;

  switch (type) {
    case 'info':
      toast.info(message, DEFAULT_TOAST_OPTIONS);
      break;
    case 'warning':
      toast.warn(message, DEFAULT_TOAST_OPTIONS);
      break;
    case 'error':
      toast.error(message, DEFAULT_TOAST_OPTIONS);
      break;
    default:
      toast(message, DEFAULT_TOAST_OPTIONS);
  }
};
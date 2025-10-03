import React from 'react';
import { ToastContainer, toast, ToastOptions, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NotificationType } from '../../api';

// Map NotificationType to visual style
const typeToClasses: Record<NotificationType, { bg: string; text: string; border: string; gradient: string }> = {
  [NotificationType.INFO]: {
    bg: 'bg-white/80',
    text: 'text-blue-800',
    border: 'border-blue-200/40',
    gradient: 'from-blue-50/80 to-indigo-50/80',
  },
  [NotificationType.WARNING]: {
    bg: 'bg-white/80',
    text: 'text-amber-800',
    border: 'border-amber-200/40',
    gradient: 'from-amber-50/80 to-yellow-50/80',
  },
  [NotificationType.ERROR]: {
    bg: 'bg-white/80',
    text: 'text-red-800',
    border: 'border-red-200/40',
    gradient: 'from-red-50/80 to-rose-50/80',
  },
};

function getIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.ERROR:
      return '❌';
    case NotificationType.WARNING:
      return '⚠️';
    default:
      return 'ℹ️';
  }
}

export function showNotification(message: string, type: NotificationType) {
  const classes = typeToClasses[type];

  const content = (
    <div className={`relative rounded-2xl border ${classes.border} p-3 sm:p-4 backdrop-blur-sm`}
         style={{
           background: `linear-gradient(135deg, rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.7))`,
         }}>
      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-2xl opacity-40"
           style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}></div>
      <div className={`flex items-start gap-3 sm:gap-4`}>        
        <div className="text-xl sm:text-2xl">{getIcon(type)}</div>
        <div className={`flex-1 ${classes.text} text-sm sm:text-base`}>{message}</div>
      </div>
    </div>
  );

  const options: ToastOptions = {
    type: type === NotificationType.ERROR ? 'error' : type === NotificationType.WARNING ? 'warning' : 'info',
    position: 'top-center',
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    theme: 'light',
    transition: Slide,
  };

  toast(content, options);
}

export const NotificationsHost: React.FC = () => {
  return (
    <ToastContainer
      position="top-center"
      newestOnTop
      closeOnClick
      draggable={false}
      pauseOnHover
      toastClassName={() => 'relative bg-transparent shadow-none p-0 m-0 min-h-0 sm:max-w-md w-[calc(100vw-1.5rem)] sm:w-auto'}
      className="!pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
};



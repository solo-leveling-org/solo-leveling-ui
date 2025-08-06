import React from 'react';

interface TelegramWidgetProps {
  type: 'no-telegram' | 'auth-error';
  errorMessage?: string;
}

export const TelegramWidget: React.FC<TelegramWidgetProps> = ({ type, errorMessage }) => {
  const isAuthError = type === 'auth-error';
  
  const backgroundGradient = isAuthError 
    ? "bg-gradient-to-br from-red-900/95 via-pink-900/95 to-red-900/95"
    : "bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-indigo-900/95";
    
  const decorativeColors = isAuthError
    ? {
        topRight: "bg-gradient-to-br from-red-400/20 to-pink-500/20",
        bottomLeft: "bg-gradient-to-tr from-pink-400/20 to-red-500/20"
      }
    : {
        topRight: "bg-gradient-to-br from-blue-400/20 to-purple-500/20",
        bottomLeft: "bg-gradient-to-tr from-purple-400/20 to-pink-500/20"
      };

  const iconGradient = isAuthError
    ? "bg-gradient-to-br from-red-500 to-red-600"
    : "bg-gradient-to-br from-blue-500 to-blue-600";

  const title = isAuthError ? "Ошибка авторизации" : "Откройте в Telegram";
  
  const description = isAuthError 
    ? errorMessage || "Произошла ошибка при авторизации"
    : "Это приложение работает только в Telegram Mini App. Нажмите кнопку ниже, чтобы открыть приложение в Telegram.";

  const buttonText = isAuthError ? "Попробовать снова" : "Открыть Solo Leveling";

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${backgroundGradient} backdrop-blur-sm`}>
      <div className="relative max-w-md mx-4 p-8 bg-white rounded-3xl shadow-2xl border border-gray-200/20 overflow-hidden">
        {/* Decorative background elements */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 ${decorativeColors.topRight} rounded-full blur-2xl`}></div>
        <div className={`absolute -bottom-8 -left-8 w-24 h-24 ${decorativeColors.bottomLeft} rounded-full blur-xl`}></div>
        
        <div className="relative z-10 text-center">
          {/* Icon */}
          <div className={`inline-flex items-center justify-center w-20 h-20 ${iconGradient} rounded-full mb-6 shadow-lg`}>
            {isAuthError ? (
              // Error Icon
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            ) : (
              // Telegram Logo
              <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
              </svg>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {title}
          </h2>
          
          <p className="text-gray-600 mb-8 leading-relaxed">
            {description}
          </p>

          {/* CTA Button */}
          <a
            href="https://t.me/solo_leveling_app_bot/solo_leveling"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group"
          >
            <svg className="w-5 h-5 mr-3 group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.13-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>
            </svg>
            {buttonText}
            <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          <div className="mt-6 text-xs text-gray-500">
            @solo_leveling_app_bot
          </div>
        </div>
      </div>
    </div>
  );
};
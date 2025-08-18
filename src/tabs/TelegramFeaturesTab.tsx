import React, { useState } from 'react';
import { useTelegramWebApp } from '../useTelegram';

type TelegramFeaturesTabProps = {
  isAuthenticated: boolean;
};

const TelegramFeaturesTab: React.FC<TelegramFeaturesTabProps> = ({ isAuthenticated }) => {
  const [popupResult, setPopupResult] = useState<string>('');
  const [modalResult, setModalResult] = useState<string>('');
  
  const { 
    webApp, 
    isAvailable, 
    showAlert, 
    showConfirm, 
    showPopup, 
    hapticFeedback 
  } = useTelegramWebApp();

  // Функция для показа простого алерта
  const handleShowAlert = () => {
    hapticFeedback.impactOccurred('light');
    showAlert('Это простой алерт от Telegram Mini App! 🚀');
  };

  // Функция для показа подтверждения
  const handleShowConfirm = () => {
    hapticFeedback.impactOccurred('medium');
    showConfirm(
      'Вы уверены, что хотите выполнить это действие?',
      (confirmed: boolean) => {
        if (confirmed) {
          hapticFeedback.notificationOccurred('success');
          showAlert('Действие подтверждено! ✅');
        } else {
          hapticFeedback.notificationOccurred('warning');
          showAlert('Действие отменено! ❌');
        }
      }
    );
  };

  // Функция для показа попапа
  const handleShowPopup = () => {
    hapticFeedback.impactOccurred('light');
    showPopup(
      {
        title: 'Информационный попап',
        message: 'Это попап с информацией от Telegram Mini App! 📱',
        buttons: [
          {
            id: 'ok',
            type: 'default',
            text: 'OK'
          },
          {
            id: 'cancel',
            type: 'default',
            text: 'Отмена'
          }
        ]
      },
              (buttonId: string | undefined) => {
          hapticFeedback.selectionChanged();
          setPopupResult(`Нажата кнопка: ${buttonId || 'unknown'}`);
          showAlert(`Вы нажали: ${buttonId || 'unknown'}`);
        }
    );
  };

    // Функция для показа модального окна (через showPopup)
  const handleShowModal = () => {
    hapticFeedback.impactOccurred('light');
    showPopup(
      {
        title: 'Модальное окно',
        message: 'Это модальное окно от Telegram Mini App! 🪟',
        buttons: [
          {
            id: 'primary',
            type: 'default',
            text: 'Основная кнопка'
          },
          {
            id: 'secondary',
            type: 'default',
            text: 'Вторичная кнопка'
          },
          {
            id: 'close',
            type: 'default',
            text: 'Закрыть'
          }
        ]
      },
      (buttonId: string | undefined) => {
        hapticFeedback.selectionChanged();
        setModalResult(`Нажата кнопка: ${buttonId || 'unknown'}`);
        showAlert(`В модальном окне нажата: ${buttonId || 'unknown'}`);
      }
    );
  };

  // Функция для показа расширенного попапа с разными типами кнопок
  const handleShowAdvancedPopup = () => {
    hapticFeedback.impactOccurred('light');
    showPopup(
      {
        title: 'Расширенный попап',
        message: 'Этот попап демонстрирует различные типы кнопок Telegram Mini App! 🎯',
        buttons: [
          {
            id: 'primary',
            type: 'default',
            text: 'Основная кнопка'
          },
          {
            id: 'destructive',
            type: 'destructive',
            text: 'Опасная кнопка'
          },
          {
            id: 'request',
            type: 'default',
            text: 'Запросить контакт'
          },
          {
            id: 'cancel',
            type: 'default',
            text: 'Отмена'
          }
        ]
      },
              (buttonId: string | undefined) => {
          hapticFeedback.selectionChanged();
          setPopupResult(`Расширенный попап: ${buttonId || 'unknown'}`);
          showAlert(`Нажата кнопка: ${buttonId || 'unknown'}`);
        }
    );
  };

    // Функция для показа модального окна с HTML контентом (через showPopup)
  const handleShowHTMLModal = () => {
    hapticFeedback.impactOccurred('light');
    showPopup(
      {
        title: 'HTML Модальное окно',
        message: `
          <div style="text-align: center; padding: 20px;">
            <h3 style="color: #3b82f6; margin-bottom: 15px;">🎨 Стилизованный контент</h3>
            <p style="color: #6b7280; line-height: 1.6;">
              Это модальное окно поддерживает <strong>HTML разметку</strong> и может содержать 
              <em>стилизованный контент</em> для лучшего пользовательского опыта.
            </p>
            <div style="margin: 20px 0; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; color: white;">
              🚀 Telegram Mini App предоставляет мощные возможности для создания интерактивных интерфейсов!
            </p>
          </div>
        `,
        buttons: [
          {
            id: 'awesome',
            type: 'default',
            text: 'Потрясающе! 🎉'
          },
          {
            id: 'close',
            type: 'default',
            text: 'Закрыть'
          }
        ]
      },
      (buttonId: string | undefined) => {
        hapticFeedback.selectionChanged();
        setModalResult(`HTML модальное окно: ${buttonId || 'unknown'}`);
        showAlert(`HTML модальное окно: ${buttonId || 'unknown'}`);
      }
    );
  };

  // Демонстрация haptic feedback
  const handleHapticDemo = () => {
    hapticFeedback.impactOccurred('light');
    setTimeout(() => hapticFeedback.impactOccurred('medium'), 200);
    setTimeout(() => hapticFeedback.impactOccurred('heavy'), 400);
    setTimeout(() => hapticFeedback.notificationOccurred('success'), 600);
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Требуется авторизация
        </h2>
        <p className="text-gray-600 mb-8">
          Для доступа к функциям Telegram Mini App необходимо войти в систему
        </p>
        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-semibold">
          <span className="mr-2">🔐</span>
          Войдите через Telegram
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Заголовок */}
      <div className="text-center">
        <div className="text-6xl mb-4">🚀</div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Telegram Mini App Функции
        </h1>
        <p className="text-gray-600 text-lg">
          Демонстрация возможностей Telegram WebApp API
        </p>
      </div>

      {/* Статус API */}
      <div className={`p-4 rounded-2xl backdrop-blur-sm border ${
        isAvailable 
          ? 'bg-green-50/80 border-green-200/30' 
          : 'bg-red-50/80 border-red-200/30'
      }`}>
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            isAvailable ? 'bg-green-500' : 'bg-red-500'
          }`}></div>
          <span className={`font-medium ${
            isAvailable ? 'text-green-700' : 'text-red-700'
          }`}>
            {isAvailable 
              ? 'Telegram WebApp API доступен' 
              : 'Telegram WebApp API недоступен'
            }
          </span>
        </div>
        {webApp && (
          <div className="mt-3 text-sm text-gray-600">
            <div>Цветовая схема: {webApp.colorScheme}</div>
            <div>Высота viewport: {webApp.viewportHeight}px</div>
            <div>Пользователь: {webApp.initDataUnsafe?.user?.first_name || 'Неизвестно'}</div>
          </div>
        )}
      </div>

      {/* Основные функции */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Show Alert */}
        <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/30">
          <div className="text-3xl mb-4">📢</div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Show Alert</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Показывает простое уведомление пользователю
          </p>
          <button
            onClick={handleShowAlert}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Показать алерт
          </button>
        </div>

        {/* Show Confirm */}
        <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/80 backdrop-blur-sm rounded-2xl p-6 border border-green-200/30">
          <div className="text-3xl mb-4">❓</div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Show Confirm</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Показывает диалог подтверждения с кнопками Да/Нет
          </p>
          <button
            onClick={handleShowConfirm}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Показать подтверждение
          </button>
        </div>

        {/* Show Popup */}
        <div className="bg-gradient-to-br from-purple-50/80 to-pink-50/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/30">
          <div className="text-3xl mb-4">🪟</div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Show Popup</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Показывает всплывающее окно с кастомными кнопками
          </p>
          <button
            onClick={handleShowPopup}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Показать попап
          </button>
        </div>

        {/* Show Modal (через showPopup) */}
        <div className="bg-gradient-to-br from-orange-50/80 to-red-50/80 backdrop-blur-sm rounded-2xl p-6 border border-orange-200/30">
          <div className="text-3xl mb-4">🪟</div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Show Modal (Popup)</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Показывает модальное окно через showPopup (HTML поддерживается)
          </p>
          <button
            onClick={handleShowModal}
            className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Показать модальное окно
          </button>
        </div>
      </div>

      {/* Расширенные функции */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Advanced Popup */}
        <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/80 backdrop-blur-sm rounded-2xl p-6 border border-indigo-200/30">
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">Расширенный Popup</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Демонстрирует различные типы кнопок: default, destructive, request_contact
          </p>
          <button
            onClick={handleShowAdvancedPopup}
            className="w-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Показать расширенный попап
          </button>
        </div>

        {/* HTML Modal (через showPopup) */}
        <div className="bg-gradient-to-br from-teal-50/80 to-cyan-50/80 backdrop-blur-sm rounded-2xl p-6 border border-teal-200/30">
          <div className="text-3xl mb-4">🎨</div>
          <h3 className="text-xl font-bold text-gray-800 mb-3">HTML Модальное окно (Popup)</h3>
          <p className="text-gray-600 mb-4 text-sm">
            Показывает модальное окно с HTML разметкой через showPopup
          </p>
          <button
            onClick={handleShowHTMLModal}
            className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Показать HTML модальное окно
          </button>
        </div>
      </div>

      {/* Haptic Feedback Demo */}
      <div className="bg-gradient-to-br from-yellow-50/80 to-amber-50/80 backdrop-blur-sm rounded-2xl p-6 border border-yellow-200/30">
        <div className="text-3xl mb-4">📳</div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Haptic Feedback</h3>
        <p className="text-gray-600 mb-4 text-sm">
          Демонстрация тактильной обратной связи на мобильных устройствах
        </p>
        <button
          onClick={handleHapticDemo}
          className="w-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        >
          Попробовать haptic feedback
        </button>
      </div>

      {/* Результаты */}
      {(popupResult || modalResult) && (
        <div className="bg-gradient-to-br from-gray-50/80 to-slate-50/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/30">
          <h3 className="text-xl font-bold text-gray-800 mb-4">📊 Результаты выполнения</h3>
          <div className="space-y-3">
            {popupResult && (
              <div className="flex items-center space-x-3 p-3 bg-blue-50/50 rounded-xl border border-blue-200/30">
                <span className="text-blue-500">📱</span>
                <span className="text-sm text-gray-700">{popupResult}</span>
              </div>
            )}
            {modalResult && (
              <div className="flex items-center space-x-3 p-3 bg-green-50/50 rounded-xl border border-green-200/30">
                <span className="text-green-500">🪟</span>
                <span className="text-sm text-gray-700">{modalResult}</span>
              </div>
            )}
          </div>
          <button
            onClick={() => {
              setPopupResult('');
              setModalResult('');
            }}
            className="mt-4 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            Очистить результаты
          </button>
        </div>
      )}

      {/* Информация о функциях */}
      <div className="bg-gradient-to-br from-slate-50/80 to-gray-50/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/30">
        <h3 className="text-xl font-bold text-gray-800 mb-4">ℹ️ Информация о функциях</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">📱 showAlert</h4>
            <p>Показывает простое уведомление. Пользователь должен нажать OK для закрытия.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">❓ showConfirm</h4>
            <p>Показывает диалог с кнопками Да/Нет. Возвращает boolean результат.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">🪟 showPopup</h4>
            <p>Показывает всплывающее окно с кастомными кнопками. Поддерживает различные типы кнопок.</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-700 mb-2">📳 Haptic Feedback</h4>
            <p>Тактильная обратная связь для мобильных устройств (вибрация, уведомления).</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">🎨 Fallback</h4>
            <p>Автоматический fallback на стандартные браузерные функции при недоступности Telegram API.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TelegramFeaturesTab;

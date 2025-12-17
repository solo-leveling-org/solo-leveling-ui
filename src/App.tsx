import {useEffect, useState} from 'react';
import './App.css';
import TasksTab from './tabs/TasksTab';
import ProfileTab from './tabs/ProfileTab';
import BalanceTab from './tabs/BalanceTab';
import CollectionsTab from './tabs/CollectionsTab';
import BottomBar from './components/BottomBar';
import {TelegramWidget} from './components/TelegramWidget';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import WelcomeTab from './tabs/WelcomeTab';
import {useAuth} from './hooks/useAuth';
import {useLocaleSync} from './hooks/useLocaleSync';
import {useWebSocketNotifications} from './hooks/useWebSocketNotifications';
import {NotificationProvider} from './components/NotificationSystem';
import {useTelegram, useTelegramWebApp} from './useTelegram';
import {ModalProvider, useModal} from './contexts/ModalContext';
import {useTelegramAdaptive} from './hooks/useTelegramAdaptive';
import AuthLoadingScreen from './components/AuthLoadingScreen';
import SessionExpiredDialog from './components/SessionExpiredDialog';
import {auth} from './auth';
import ConfirmDialog from './components/ConfirmDialog';
import {useUiUpdate} from './hooks/useUiUpdate';
import {useLocalization} from './hooks/useLocalization';

// Глобальный ref для хранения обработчика кнопки "Назад" (экспортируем для использования в CollectionsTab)
export const globalBackButtonHandlerRef = { current: null as (() => void) | null };

function AppRoutes() {
  const location = useLocation();
  const { isBottomBarVisible } = useModal();
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const { backButton } = useTelegramWebApp();
  const { t } = useLocalization();
  const { isUpdateAvailable, reason: updateReason, refreshNow } = useUiUpdate();
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  
  // Инициализируем Telegram WebApp
  useTelegram();
  
  // Централизованное управление адаптивностью (определение устройства, полноэкранный режим, CSS классы)
  useTelegramAdaptive();

  // Глобальное управление кнопкой "Назад" - скрываем при переходе на табы, где она не нужна
  useEffect(() => {
    const isOnCollectionsTab = location.pathname === '/collections' || location.pathname === '/leaderboard';
    
    if (!isOnCollectionsTab) {
      // Удаляем обработчик перед скрытием кнопки
      if (globalBackButtonHandlerRef.current) {
        backButton.offClick(globalBackButtonHandlerRef.current);
        globalBackButtonHandlerRef.current = null;
      }
      // Скрываем кнопку "Назад" при переходе на другие табы
      backButton.hide();
    }
  }, [location.pathname, backButton]);

  // Используем новые хуки для разделения логики
  const {
    isAuthenticated,
    showNoTelegramError,
    isTelegramChecked,
    authError,
    isAuthLoading,
    authPromise
  } = useAuth();
  // Синхронизация локализации (загружается только после успешной авторизации)
  const { isLocaleLoading, localeLoaded } = useLocaleSync(isAuthenticated);

  // Подключение к WebSocket после успешной авторизации
  useWebSocketNotifications({enabled: isAuthenticated, authPromise});

  // Регистрируем callback для обработки истечения сессии
  useEffect(() => {
    auth.onSessionExpired(() => {
      setIsSessionExpired(true);
    });
  }, []);

  useEffect(() => {
    if (isUpdateAvailable) setIsUpdateDialogOpen(true);
  }, [isUpdateAvailable]);

  // Автоматический скролл наверх при смене маршрута
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({top: 0, left: 0, behavior: 'auto'});
    }
  }, [location.pathname]);

  // Обработчик обновления страницы при истечении сессии
  const handleRefreshPage = () => {
    window.location.reload();
  };

  const handleUpdateConfirm = () => {
    refreshNow();
  };

  const handleUpdateCancel = () => {
    // Мягкий режим: не форсим reload, просто закрываем.
    // Если пользователю реально прилетит chunk 404 — сработает ChunkLoadError и мы снова предложим обновиться.
    setIsUpdateDialogOpen(false);
  };


  // Показываем экран загрузки пока идет авторизация ИЛИ (после авторизации) загрузка локализации
  // Локализация загружается только после успешной авторизации
  // Если пользователь авторизован, показываем загрузку пока локализация не загружена
  const shouldShowLoading = isAuthLoading || (isAuthenticated && (isLocaleLoading || !localeLoaded));

  return (
      <div className="App">
        {/* Экран загрузки авторизации и локализации */}
        <AuthLoadingScreen isLoading={shouldShowLoading} />
        
        {/* Диалог истечения сессии */}
        <SessionExpiredDialog 
          isOpen={isSessionExpired} 
          onRefresh={handleRefreshPage}
        />

        <ConfirmDialog
          isOpen={isUpdateDialogOpen}
          message={
            updateReason === 'chunk_load_error'
              ? t('dialogs.uiUpdate.chunkErrorMessage')
              : t('dialogs.uiUpdate.message')
          }
          onConfirm={handleUpdateConfirm}
          onCancel={handleUpdateCancel}
          confirmText={t('dialogs.uiUpdate.refreshButton')}
          cancelText={t('dialogs.uiUpdate.laterButton')}
        />
        
        {!isTelegramChecked ? null : (
            <>
              {showNoTelegramError && (
                  <TelegramWidget type="no-telegram"/>
              )}
              {authError && !showNoTelegramError && (
                  <TelegramWidget type="auth-error" errorMessage={authError}/>
              )}
              {!showNoTelegramError && !authError && (
                  <>
                    <main className={`tab-content custom-scrollbar ${isBottomBarVisible ? 'tab-content-with-bottom-bar' : 'tab-content-without-bottom-bar'}`}>
                      <Routes>
                        <Route path="/" element={<WelcomeTab/>}/>
                        <Route path="/welcome" element={<WelcomeTab/>}/>
                        <Route path="/tasks"
                               element={<TasksTab isAuthenticated={isAuthenticated}/>}/>
                        <Route path="/profile"
                               element={<ProfileTab isAuthenticated={isAuthenticated}/>}/>
                        <Route path="/collections"
                               element={<CollectionsTab isAuthenticated={isAuthenticated}/>}/>
                        <Route path="/leaderboard"
                               element={<CollectionsTab isAuthenticated={isAuthenticated}/>}/>
                        <Route path="/balance"
                               element={<BalanceTab isAuthenticated={isAuthenticated}/>}/>
                        <Route path="*" element={<Navigate to="/profile" replace/>}/>
                      </Routes>
                    </main>
                    {isAuthenticated && <BottomBar isAuthenticated={isAuthenticated} isVisible={isBottomBarVisible}/>}
                  </>
              )}
            </>
        )}
      </div>
  );
}

export default function App() {
  return (
      <ModalProvider>
      <NotificationProvider>
          <Router>
            <AppRoutes/>
          </Router>
        </NotificationProvider>
        </ModalProvider>
  );
}

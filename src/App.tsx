import {useEffect} from 'react';
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
import {useTelegram} from './useTelegram';
import {ModalProvider, useModal} from './contexts/ModalContext';
import {useTelegramAdaptive} from './hooks/useTelegramAdaptive';
import AuthLoadingScreen from './components/AuthLoadingScreen';

function AppRoutes() {
  const location = useLocation();
  const { isBottomBarVisible } = useModal();
  
  // Инициализируем Telegram WebApp
  useTelegram();
  
  // Централизованное управление адаптивностью (определение устройства, полноэкранный режим, CSS классы)
  useTelegramAdaptive();

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

  // Автоматический скролл наверх при смене маршрута
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({top: 0, left: 0, behavior: 'auto'});
    }
  }, [location.pathname]);


  // Показываем экран загрузки пока идет авторизация ИЛИ (после авторизации) загрузка локализации
  // Локализация загружается только после успешной авторизации
  // Если пользователь авторизован, показываем загрузку пока локализация не загружена
  const shouldShowLoading = isAuthLoading || (isAuthenticated && (isLocaleLoading || !localeLoaded));

  return (
      <div className="App">
        {/* Экран загрузки авторизации и локализации */}
        <AuthLoadingScreen isLoading={shouldShowLoading} />
        
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
                        <Route path="/games"
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

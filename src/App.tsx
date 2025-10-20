import {useEffect} from 'react';
import './App.css';
import TasksTab from './tabs/TasksTab';
import ProfileTab from './tabs/ProfileTab';
import BalanceTab from './tabs/BalanceTab';
import BottomBar from './components/BottomBar';
import {TelegramWidget} from './components/TelegramWidget';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation
} from 'react-router-dom';
import TopicsTab from './tabs/TopicsTab';
import WelcomeTab from './tabs/WelcomeTab';
import {useSettings} from './hooks/useSettings';
import {useAuth} from './hooks/useAuth';
import {useLocaleSync} from './hooks/useLocaleSync';
import WelcomeTabSkeleton from './components/WelcomeTabSkeleton';
import {useWebSocketNotifications} from './hooks/useWebSocketNotifications';
import {NotificationProvider} from './components/NotificationSystem';
import {useTelegram} from './useTelegram';
import {ModalProvider, useModal} from './contexts/ModalContext';

function AppRoutes() {
  const location = useLocation();
  const { isBottomBarVisible } = useModal();
  
  // Инициализируем Telegram WebApp
  useTelegram();

  // Используем новые хуки для разделения логики
  const {
    isAuthenticated,
    showNoTelegramError,
    isTelegramChecked,
    authError,
    authPromise
  } = useAuth();
  const {localeLoaded, setLocaleLoaded} = useSettings();

  // Синхронизация локализации
  useLocaleSync(isAuthenticated);

  // Подключение к WebSocket после успешной авторизации
  useWebSocketNotifications({enabled: isAuthenticated, authPromise});

  // Устанавливаем localeLoaded для случаев без авторизации
  useEffect(() => {
    if (isTelegramChecked && (!isAuthenticated || showNoTelegramError || authError)) {
      setLocaleLoaded(true);
    }
  }, [isTelegramChecked, isAuthenticated, showNoTelegramError, authError, setLocaleLoaded]);

  // Автоматический скролл наверх при смене маршрута
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo({top: 0, left: 0, behavior: 'auto'});
    }
  }, [location.pathname]);


  // Показываем skeleton до загрузки локализации
  if (!localeLoaded) {
    return <WelcomeTabSkeleton/>;
  }

  return (
      <div className="App">
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
                        <Route path="/topics"
                               element={<TopicsTab isAuthenticated={isAuthenticated}/>}/>
                        <Route path="/profile"
                               element={<ProfileTab isAuthenticated={isAuthenticated}/>}/>
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
      <NotificationProvider>
        <ModalProvider>
          <Router>
            <AppRoutes/>
          </Router>
        </ModalProvider>
      </NotificationProvider>
  );
}

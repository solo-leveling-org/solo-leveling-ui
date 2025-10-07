import {useEffect, useState} from 'react';
import './App.css';
import SideDrawer from './components/SideDrawer';
import TasksTab from './tabs/TasksTab';
import ProfileTab from './tabs/ProfileTab';
import TopBar from './components/TopBar';
import {TelegramWidget} from './components/TelegramWidget';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation
} from 'react-router-dom';
import TopicsTab from './tabs/TopicsTab';
import WelcomeTab from './tabs/WelcomeTab';
import {useLocalization} from './hooks/useLocalization';
import { useSettings } from './hooks/useSettings';
import { useAuth } from './hooks/useAuth';
import { useLocaleSync } from './hooks/useLocaleSync';
import WelcomeTabSkeleton from './components/WelcomeTabSkeleton';
import { useWebSocketNotifications } from './hooks/useWebSocketNotifications';
import { NotificationProvider } from './components/NotificationSystem';

function AppRoutes() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Используем новые хуки для разделения логики
  const { isAuthenticated, showNoTelegramError, isTelegramChecked, authError } = useAuth();
  const { localeLoaded, setLocaleLoaded } = useSettings();
  const { t } = useLocalization();
  
  // Синхронизация локализации
  useLocaleSync(isAuthenticated);

  // Подключение к WebSocket после успешной авторизации
  useWebSocketNotifications(isAuthenticated);

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

  // Конфигурация табов
  const tabsConfig = [
    { path: '/', key: 'welcome' },
    { path: '/profile', key: 'profile' },
    { path: '/tasks', key: 'tasks' },
    { path: '/topics', key: 'topics' },
  ];

  // Генерируем tabList для SideDrawer
  const tabList = tabsConfig.map(tab => ({
    label: t(`navigation.${tab.key}`),
    active: location.pathname === tab.path,
    onClick: () => {
      navigate(tab.path);
      setDrawerOpen(false);
    },
  }));

  // Показываем skeleton до загрузки локализации
  if (!localeLoaded) {
    return <WelcomeTabSkeleton />;
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
                    <TopBar
                        title={''}
                        onHamburgerClick={() => setDrawerOpen(!drawerOpen)}
                        hamburgerOpen={drawerOpen}
                    />
                    <SideDrawer open={drawerOpen} tabs={tabList}
                                onClose={() => setDrawerOpen(false)}/>
                    <main className="tab-content">
                      <Routes>
                        <Route path="/" element={<WelcomeTab/>}/>
                        <Route path="/tasks"
                               element={<TasksTab isAuthenticated={isAuthenticated}/>}/>
                        <Route path="/topics"
                               element={<TopicsTab isAuthenticated={isAuthenticated}/>}/>
                        <Route path="/profile"
                               element={<ProfileTab isAuthenticated={isAuthenticated}/>}/>
                        <Route path="*" element={<Navigate to="/" replace/>}/>
                      </Routes>
                    </main>
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
        <Router>
          <AppRoutes/>
        </Router>
      </NotificationProvider>
  );
}

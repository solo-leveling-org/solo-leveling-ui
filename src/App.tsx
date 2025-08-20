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
import {useTelegram} from './useTelegram';
import {auth} from './auth';
import { useLocalization } from './hooks/useLocalization';

function AppRoutes() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  // Состояние авторизации - true только после успешного логина
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {initData, tgWebAppData} = useTelegram();
  const [showNoTelegramError, setShowNoTelegramError] = useState(false);
  const [isTelegramChecked, setIsTelegramChecked] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const { t } = useLocalization();

  // Шаг 1: Авторизация через Telegram при загрузке приложения
  useEffect(() => {
    if (initData !== undefined && tgWebAppData !== undefined) {
      if (initData && tgWebAppData) {
        auth.loginWithTelegram(initData, tgWebAppData)
        .then(() => {
          setAuthError(null);
          setIsAuthenticated(true); // Устанавливаем флаг авторизации
        })
        .catch((e) => {
          setAuthError(e.message || 'Ошибка авторизации');
          setIsAuthenticated(false);
        });
        setShowNoTelegramError(false);
      } else {
        setShowNoTelegramError(true);
        setAuthError(null);
        setIsAuthenticated(false);
      }
      setIsTelegramChecked(true);
    }
  }, [initData, tgWebAppData]);

  // Шаг 2: Проверяем, есть ли уже сохраненные токены в localStorage
  useEffect(() => {
    if (isTelegramChecked && !showNoTelegramError && !authError) {
      const hasTokens = auth.isAuthenticated();
      setIsAuthenticated(hasTokens);
    }
  }, [isTelegramChecked, showNoTelegramError, authError]);

  // Автоматический скролл наверх при смене маршрута
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // tabList для SideDrawer
  const tabList = [
    {
      label: t('navigation.welcome'),
      active: location.pathname === '/',
      onClick: () => {
        navigate('/');
        setDrawerOpen(false);
      },
    },
    {
      label: t('navigation.profile'),
      active: location.pathname === '/profile',
      onClick: () => {
        navigate('/profile');
        setDrawerOpen(false);
      },
    },
    {
      label: t('navigation.tasks'),
      active: location.pathname === '/tasks',
      onClick: () => {
        navigate('/tasks');
        setDrawerOpen(false);
      },
    },
    {
      label: t('navigation.topics'),
      active: location.pathname === '/topics',
      onClick: () => {
        navigate('/topics');
        setDrawerOpen(false);
      },
    }
  ];

  return (
      <div className="App">
        {!isTelegramChecked ? null : (
            <>
              {showNoTelegramError && (
                  <TelegramWidget type="no-telegram" />
              )}
              {authError && !showNoTelegramError && (
                  <TelegramWidget type="auth-error" errorMessage={authError} />
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
                        <Route path="/" element={<WelcomeTab />}/>
                        <Route path="/tasks" element={<TasksTab isAuthenticated={isAuthenticated} />}/>
                        <Route path="/topics" element={<TopicsTab isAuthenticated={isAuthenticated} />}/>
                        <Route path="/profile" element={<ProfileTab isAuthenticated={isAuthenticated} />}/>
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
      <Router>
        <AppRoutes/>
      </Router>
  );
}

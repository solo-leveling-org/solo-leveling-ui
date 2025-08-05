import { useEffect, useState } from 'react';
import './App.css';
import { api } from './services';
import type { PlayerTask } from './api';
import { TaskTopic } from './api';
import type { User } from './api';
import type { GetActiveTasksResponse } from './api';
import SideDrawer from './components/SideDrawer';
import TasksTab from './features/Tasks/TasksTab';
import ProfileTab, { ProfileSkeleton } from './features/Profile/ProfileTab';
import TopBar from './components/TopBar';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import TopicsTab from './features/Topics/TopicsTab';
import { useTelegram } from './useTelegram';
import { auth } from './auth';

function AppRoutes() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<PlayerTask[]>([]);
  const [selectedTopics] = useState<TaskTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const {initData, tgWebAppData } = useTelegram();
  const [showNoTelegramError, setShowNoTelegramError] = useState(false);
  const [isTelegramChecked, setIsTelegramChecked] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const allTopics = Object.values(TaskTopic);

  useEffect(() => {
    if (initData !== undefined && tgWebAppData !== undefined) {
      if (initData && tgWebAppData) {
        auth.loginWithTelegram(initData, tgWebAppData)
          .then(() => setAuthError(null))
          .catch((e) => setAuthError(e.message || 'Ошибка авторизации'));
        setShowNoTelegramError(false);
      } else {
        setShowNoTelegramError(true);
        setAuthError(null);
      }
      setIsTelegramChecked(true);
    }
  }, [initData, tgWebAppData]);

  // tabList для SideDrawer
  const tabList = [
    {
      label: 'Задачи',
      active: location.pathname === '/tasks',
      onClick: () => { navigate('/tasks'); setDrawerOpen(false); },
    },
    {
      label: 'Темы',
      active: location.pathname === '/topics',
      onClick: () => { navigate('/topics'); setDrawerOpen(false); },
    },
    {
      label: 'Профиль',
      active: location.pathname === '/profile',
      onClick: () => { navigate('/profile'); setDrawerOpen(false); },
    },
  ];

  useEffect(() => {
    api.getUser().then(setUser);
  }, []);

  // Загрузка задач с новым endpoint
  useEffect(() => {
    if (location.pathname === '/tasks') {
      setLoading(true);
      setTasks([]);
      api.getPlayerTasks().then((res: GetActiveTasksResponse) => {
        setTasks(res.tasks);
        setLoading(false);
      });
    }
    if (location.pathname === '/profile') {
      setUser(null);
      api.getUser().then(setUser);
    }
  }, [location.pathname]);

  return (
    <div className="App">
      {!isTelegramChecked ? null : (
        <>
          {showNoTelegramError && (
            <div className="no-telegram-error-overlay">
              <div className="no-telegram-error">
                <b>Ошибка:</b> Данное приложение предназначено для запуска только внутри Telegram Mini App.<br/>
                Данные Telegram не найдены.
              </div>
            </div>
          )}
          {authError && !showNoTelegramError && (
            <div className="no-telegram-error-overlay">
              <div className="no-telegram-error">
                <b>Ошибка авторизации:</b><br/>
                {authError}
              </div>
            </div>
          )}
          {!showNoTelegramError && !authError && (
            <>
              <TopBar
                title={''}
                onHamburgerClick={() => setDrawerOpen(!drawerOpen)}
                hamburgerOpen={drawerOpen}
              />
              <SideDrawer open={drawerOpen} tabs={tabList} onClose={() => setDrawerOpen(false)} />
              <main className="tab-content">
                <Routes>
                  <Route path="/tasks" element={<TasksTab tasks={tasks} topics={allTopics} selectedTopics={selectedTopics} onTopicToggle={() => {}} onGenerateTasks={() => {}} onResetTasks={() => {}} loading={loading} setTasks={setTasks} onGoToTopics={() => navigate('/topics')} />} />
                  <Route path="/topics" element={<TopicsTab allTopics={allTopics} />} />
                  <Route path="/profile" element={user ? <ProfileTab user={user} /> : <ProfileSkeleton />} />
                  <Route path="*" element={<Navigate to="/tasks" replace />} />
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
      <AppRoutes />
    </Router>
  );
}

import { useEffect, useState } from 'react';
import './App.css';
import { api } from './services';
import { PlayerTask, TaskTopic, User, PlayerTasksResponse } from './types';
import SideDrawer from './components/SideDrawer';
import TasksTab from './features/Tasks/TasksTab';
import ProfileTab, { ProfileSkeleton } from './features/Profile/ProfileTab';
import TopBar from './components/TopBar';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom';
import TopicsTab from './features/Topics/TopicsTab';

function AppRoutes() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<PlayerTask[]>([]);
  const [topics, setTopics] = useState<TaskTopic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<TaskTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [tasksCount, setTasksCount] = useState<number>(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
    api.getTopics().then(setTopics);
  }, []);

  // Загрузка задач с новым endpoint
  useEffect(() => {
    if (location.pathname === '/tasks') {
      setLoading(true);
      setTasks([]);
      api.getPlayerTasks().then((res: PlayerTasksResponse) => {
        setTasks(res.tasks);
        setTasksCount(res.count);
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
      <TopBar
        title={''}
        onHamburgerClick={() => setDrawerOpen(!drawerOpen)}
        hamburgerOpen={drawerOpen}
      />
      <SideDrawer open={drawerOpen} tabs={tabList} onClose={() => setDrawerOpen(false)} />
      <main className="tab-content">
        <Routes>
          <Route path="/tasks" element={<TasksTab tasks={tasks} topics={topics} selectedTopics={selectedTopics} onTopicToggle={() => {}} onGenerateTasks={() => {}} onResetTasks={() => {}} loading={loading} setTasks={setTasks} onGoToTopics={() => navigate('/topics')} />} />
          <Route path="/topics" element={<TopicsTab allTopics={topics} />} />
          <Route path="/profile" element={user ? <ProfileTab user={user} /> : <ProfileSkeleton />} />
          <Route path="*" element={<Navigate to="/tasks" replace />} />
        </Routes>
      </main>
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

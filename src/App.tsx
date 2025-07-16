import React, { useEffect, useState } from 'react';
import './App.css';
import { api } from './services';
import { PlayerTask, TaskTopic, User } from './types';
import SideDrawer from './components/SideDrawer';
import TasksTab from './features/Tasks/TasksTab';
import ProfileTab from './features/Profile/ProfileTab';
import TopBar from './components/TopBar';

const TABS = ['Profile', 'Tasks'] as const;
type Tab = typeof TABS[number];

function App() {
  const [tab, setTab] = useState<Tab>('Tasks');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<PlayerTask[]>([]);
  const [topics, setTopics] = useState<TaskTopic[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<TaskTopic[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getUser().then(setUser);
    api.getTopics().then(setTopics);
    api.getTasks().then(setTasks);
  }, []);

  const handleTopicToggle = (topic: TaskTopic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const handleGenerateTasks = async () => {
    setLoading(true);
    setTasks([]); // Clear tasks immediately to show skeletons
    const newTasks = await api.generateTasks(selectedTopics);
    setTasks(newTasks);
    setLoading(false);
  };

  const handleResetTasks = async () => {
    setLoading(true);
    await api.resetTasks();
    setTasks([]);
    setSelectedTopics([]);
    setLoading(false);
  };

  const tabList = [
    {
      label: 'Profile',
      active: tab === 'Profile',
      onClick: () => { setTab('Profile'); setDrawerOpen(false); },
    },
    {
      label: 'Tasks',
      active: tab === 'Tasks',
      onClick: () => { setTab('Tasks'); setDrawerOpen(false); },
    },
  ];

  return (
    <div className="App">
      <TopBar
        title={tab === 'Profile' ? 'Profile' : 'Tasks'}
        onHamburgerClick={() => setDrawerOpen(!drawerOpen)}
        hamburgerOpen={drawerOpen}
      />
      <SideDrawer open={drawerOpen} tabs={tabList} onClose={() => setDrawerOpen(false)} />
      <main className="tab-content">
        {tab === 'Profile' && user && (
          <ProfileTab user={user} />
        )}
        {tab === 'Tasks' && (
          <TasksTab
            tasks={tasks}
            topics={topics}
            selectedTopics={selectedTopics}
            onTopicToggle={handleTopicToggle}
            onGenerateTasks={handleGenerateTasks}
            onResetTasks={handleResetTasks}
            loading={loading}
            setTasks={setTasks}
          />
        )}
      </main>
    </div>
  );
}

export default App;

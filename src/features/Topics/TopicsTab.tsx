import React, { useEffect, useState } from 'react';
import { TaskTopic, UserTopicsResponse } from '../../types';
import { api } from '../../services';
import { useNavigate } from 'react-router-dom';

const topicIcons: Record<string, string> = {
  PHYSICAL_ACTIVITY: '🏃‍♂️',
  MENTAL_HEALTH: '🧠',
  EDUCATION: '📚',
  SOCIAL: '🤝',
  CREATIVITY: '🎨',
  FINANCE: '💸',
  CAREER: '💼',
  MINDFULNESS: '🧘‍♂️',
};

const TopicsTab: React.FC<{ allTopics: TaskTopic[] }> = ({ allTopics }) => {
  const [userTopics, setUserTopics] = useState<TaskTopic[]>([]);
  const [firstTime, setFirstTime] = useState(false);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    api.getUserTopics().then((res: UserTopicsResponse) => {
      setUserTopics(res.topics);
      setFirstTime(res.first_time);
    });
  }, []);

  const handleToggle = (topic: TaskTopic) => {
    setUserTopics((prev) => prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]);
  };

  const handleSave = async () => {
    setSaving(true);
    await api.saveUserTopics(userTopics);
    if (firstTime) {
      await api.generateTasks(userTopics);
    }
    setSaving(false);
    if (firstTime) navigate('/tasks');
  };

  return (
    <div className="topic-select-hero">
      <h2 className="topic-select-hero-title">Выбор топиков</h2>
      <div className="topics-grid">
        {allTopics.map(topic => (
          <button
            key={topic}
            className={`topic-card${userTopics.includes(topic) ? ' selected' : ''}`}
            type="button"
            onClick={() => handleToggle(topic)}
          >
            <span className="topic-card-icon">{topicIcons[topic] || '❓'}</span>
            <span className="topic-card-label">{topic.replace('_', ' ')}</span>
            {userTopics.includes(topic) && <span className="topic-card-check">✔</span>}
          </button>
        ))}
      </div>
      <div className="topic-select-hero-subtitle mb-2">{firstTime ? 'Первый вход: после выбора топиков вы будете перенаправлены к задачам.' : 'Вы можете изменить свои топики.'}</div>
      <button className="generate-btn hero-generate-btn" onClick={handleSave} disabled={saving || userTopics.length === 0}>
        {saving ? 'Сохраняю...' : 'Сохранить'}
      </button>
    </div>
  );
};

export default TopicsTab; 
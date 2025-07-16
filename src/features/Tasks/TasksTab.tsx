import React, { useState } from 'react';
import { PlayerTask, TaskTopic, PlayerTaskStatus } from '../../types';
import TasksGrid from '../../components/TasksGrid';
import TaskDialog from '../../components/TaskDialog';
import { taskActions } from '../../services';

type TasksTabProps = {
  tasks: PlayerTask[];
  topics: TaskTopic[];
  selectedTopics: TaskTopic[];
  onTopicToggle: (t: TaskTopic) => void;
  onGenerateTasks: () => void;
  onResetTasks: () => void;
  loading: boolean;
  setTasks: React.Dispatch<React.SetStateAction<PlayerTask[]>>;
};

const TasksTab: React.FC<TasksTabProps> = ({
  tasks,
  topics,
  selectedTopics,
  onTopicToggle,
  onGenerateTasks,
  onResetTasks,
  loading,
  setTasks,
}) => {
  const [dialogTask, setDialogTask] = useState<PlayerTask | null>(null);

  if (loading) {
    return <TasksGrid tasks={[]} loading={true} onTaskClick={() => {}} />;
  }
  if (!tasks.length) {
    // Emoji-иконки для тем
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
    return (
      <div className="topic-select-hero">
        <h2 className="topic-select-hero-title">Выбери свои темы</h2>
        <p className="topic-select-hero-subtitle">Это поможет подобрать для тебя лучшие задачи</p>
        <div className="topics-grid">
          {topics.map(topic => (
            <button
              key={topic}
              className={`topic-card${selectedTopics.includes(topic) ? ' selected' : ''}`}
              onClick={() => onTopicToggle(topic)}
              type="button"
            >
              <span className="topic-card-icon">{topicIcons[topic] || '❓'}</span>
              <span className="topic-card-label">{topic.replace('_', ' ')}</span>
              {selectedTopics.includes(topic) && <span className="topic-card-check">✔</span>}
            </button>
          ))}
        </div>
        <button
          className="generate-btn hero-generate-btn"
          onClick={onGenerateTasks}
          disabled={selectedTopics.length === 0 || loading}
        >
          <span>Сгенерировать задачи</span>
          <span style={{ fontSize: '1.3em', marginLeft: '0.3em' }}>➡️</span>
        </button>
      </div>
    );
  }
  return (
    <div>
      <button className="reset-btn" onClick={onResetTasks} disabled={loading}>
        Reset Tasks
      </button>
      <TasksGrid
        tasks={tasks}
        loading={loading}
        onTaskClick={(ptask) => {
          if (ptask.task) setDialogTask(ptask);
        }}
        onComplete={async (ptask) => {
          if (loading) return;
          const updated = await taskActions.completeTask(ptask.id);
          setTasks(updated);
        }}
        onReplace={async (ptask) => {
          if (loading) return;
          // Сначала локально меняем статус на PREPARING
          setTasks((prev: PlayerTask[]) => prev.map((t: PlayerTask) => t.id === ptask.id ? { ...t, status: PlayerTaskStatus.PREPARING } : t));
          // Затем имитируем REST API запрос
          const updated = await taskActions.replaceTask(ptask.id, selectedTopics);
          setTasks(updated);
        }}
      />
      {dialogTask && dialogTask.task && (
        <TaskDialog task={dialogTask.task} onClose={() => setDialogTask(null)} />
      )}
    </div>
  );
};

export default TasksTab; 
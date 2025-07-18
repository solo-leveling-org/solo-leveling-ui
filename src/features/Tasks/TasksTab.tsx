import React, { useState } from 'react';
import { PlayerTask, TaskTopic, PlayerTaskStatus } from '../../types';
import TasksGrid from '../../components/TasksGrid';
import TaskDialog from '../../components/TaskDialog';
import { taskActions } from '../../services';
import './TasksTab.css';

type TasksTabProps = {
  tasks: PlayerTask[];
  topics: TaskTopic[];
  selectedTopics: TaskTopic[];
  onTopicToggle: (t: TaskTopic) => void;
  onGenerateTasks: () => void;
  onResetTasks: () => void;
  loading: boolean;
  setTasks: React.Dispatch<React.SetStateAction<PlayerTask[]>>;
  onGoToTopics: () => void;
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
  onGoToTopics,
}) => {
  const [dialogTask, setDialogTask] = useState<PlayerTask | null>(null);

  if (loading) {
    return <TasksGrid tasks={[]} loading={true} onTaskClick={() => {}} />;
  }
  if (!tasks.length) {
    return (
      <div className="topic-select-hero">
        <h2 className="topic-select-hero-title">Выбери свои темы</h2>
        <p className="topic-select-hero-subtitle">Это поможет подобрать для тебя лучшие задачи</p>
        <button
          className="generate-btn hero-generate-btn mt-4"
          onClick={onGoToTopics}
        >
          <span>Выбрать топики</span>
        </button>
      </div>
    );
  }
  return (
    <div>
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
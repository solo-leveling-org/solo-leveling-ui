import React from 'react';
import type { Task } from '../api';
import { topicIcons, topicLabels } from '../topicMeta';

type TaskDialogProps = {
  task: Task;
  onClose: () => void;
};

const TaskDialog: React.FC<TaskDialogProps> = ({ task, onClose }) => (
  <div className="dialog-backdrop" onClick={onClose}>
    <div className="task-dialog" onClick={e => e.stopPropagation()}>
      <button className="dialog-close" onClick={onClose}>&times;</button>
      <div className="dialog-header" style={{position: 'relative'}}>
        <h2 className="task-title" style={{paddingRight: 32}}>{task.title}</h2>
        <span className={`rarity-pill rarity-${(task.rarity || 'COMMON').toLowerCase()}`}></span>
      </div>
      <div className="task-desc">{task.description}</div>
      <div className="task-attributes">
        <div className="attr-col">
          <span className="attr-icon xp">⭐️</span>
          <span className="attr-value xp">{task.experience}</span>
          <span className="attr-label">XP</span>
        </div>
        <div className="attr-col">
          <span className="attr-icon agility">🟢</span>
          <span className="attr-value agility">{task.agility}</span>
          <span className="attr-label">Agility</span>
        </div>
        <div className="attr-col">
          <span className="attr-icon strength">🔴</span>
          <span className="attr-value strength">{task.strength}</span>
          <span className="attr-label">Strength</span>
        </div>
        <div className="attr-col">
          <span className="attr-icon intelligence">🔵</span>
          <span className="attr-value intelligence">{task.intelligence}</span>
          <span className="attr-label">Intelligence</span>
        </div>
      </div>
      <div className="task-labels">
        {(task.topics || []).map((t) => (
          <span className="topic-label" key={t}>
            {topicIcons[t] || '❓'} {topicLabels[t] || t}
          </span>
        ))}
      </div>
    </div>
  </div>
);

export default TaskDialog; 
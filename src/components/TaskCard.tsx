import React from 'react';
import { PlayerTask, PlayerTaskStatus } from '../types';
import { ReactComponent as DoneIcon } from '../assets/icons/done.svg';
import { ReactComponent as RefreshIcon } from '../assets/icons/refresh.svg';

type TaskCardProps = {
  playerTask: PlayerTask;
  onClick: () => void;
  onComplete?: () => void;
  onReplace?: () => void;
};

const TaskCard: React.FC<TaskCardProps> = ({ playerTask, onClick, onComplete, onReplace }) => {
  const { task, status } = playerTask;
  let statusMod = '';
  if (status === PlayerTaskStatus.PREPARING) statusMod = 'task-card--preparing';
  if (status === PlayerTaskStatus.IN_PROGRESS) statusMod = 'task-card--inprogress';
  if (status === PlayerTaskStatus.PENDING_COMPLETION) statusMod = 'task-card--pending';

  return (
    <div className={`task-card ${statusMod}`} onClick={onClick}>
      {status === PlayerTaskStatus.PREPARING ? (
        <>
          <div className="skeleton-title skeleton-shimmer" style={{ width: '70%', height: '1.2em', margin: '1.2rem auto 0.7rem auto' }} />
          <div className="skeleton-desc skeleton-shimmer" style={{ width: '90%', height: '1em', margin: '0 auto 1.2rem auto' }} />
          <div className="preparing-label">Задача генерируется...</div>
        </>
      ) : (
        <>
          <div className="task-card-header">
            <span className="task-card-title">{task.title}</span>
            <span className={`rarity-pill shimmer-rarity rarity-${task.rarity.toLowerCase()}`}>{task.rarity}</span>
          </div>
          <div className="task-card-desc">{task.description}</div>
          <div className="task-labels">
            {task.topics.map((t) => (
              <span className="topic-label" key={t}>{t.replace('_', ' ')}</span>
            ))}
          </div>
          {status === PlayerTaskStatus.IN_PROGRESS && (
            <div className="task-actions-row">
              <button
                onClick={e => { e.stopPropagation(); onComplete && onComplete(); }}
              >
                <DoneIcon width={28} height={28} />
              </button>
              <button
                onClick={e => { e.stopPropagation(); onReplace && onReplace(); }}
              >
                <RefreshIcon width={28} height={28} />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TaskCard; 
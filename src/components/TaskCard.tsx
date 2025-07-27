import React from 'react';
import { PlayerTask, PlayerTaskStatus, TaskTopic } from '../types';
import { ReactComponent as DoneIcon } from '../assets/icons/done.svg';
import { ReactComponent as RefreshIcon } from '../assets/icons/refresh.svg';
import { topicIcons, topicLabels } from '../topicMeta';

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
          <div className="skeleton-title shimmer-effect" style={{ width: '70%', height: '1.2em', margin: '1.2rem auto 0.7rem auto' }} />
          <div className="skeleton-desc shimmer-effect" style={{ width: '90%', height: '1em', margin: '0 auto 1.2rem auto' }} />
          <div className="preparing-label">Задача генерируется...</div>
        </>
      ) : (
        <>
          <div className="task-card-header" style={{position: 'relative'}}>
            <span className="task-card-title">{task.title}</span>
            <span className={`rarity-pill rarity-${task.rarity.toLowerCase()}`}></span>
          </div>
          <div className="task-card-desc">{task.description}</div>
          <div className="task-labels">
            {task.topics.map((t) => (
              <span className="topic-label" key={t}>
                {topicIcons[t] || '❓'} {topicLabels[t] || t}
              </span>
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
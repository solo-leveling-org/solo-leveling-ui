import React from 'react';
import { ReactComponent as ActivityIcon } from '../assets/icons/activity.svg';
import { ReactComponent as BrainIcon } from '../assets/icons/brain.svg';
import { ReactComponent as BookIcon } from '../assets/icons/book.svg';
import { ReactComponent as PaintbrushIcon } from '../assets/icons/paintbrush.svg';
import { ReactComponent as MessageCircleIcon } from '../assets/icons/message-circle.svg';
import { ReactComponent as SaladIcon } from '../assets/icons/salad.svg';
import { ReactComponent as ClockIcon } from '../assets/icons/clock.svg';
import { ReactComponent as FlaskRoundIcon } from '../assets/icons/flask-round.svg';
import { ReactComponent as LeafIcon } from '../assets/icons/leaf.svg';
import { ReactComponent as HandshakeIcon } from '../assets/icons/handshake.svg';
import { TaskTopic } from '../api';

interface TopicIconProps {
  topic: TaskTopic;
  className?: string;
  size?: number;
}

const TopicIcon: React.FC<TopicIconProps> = ({ topic, className = '', size = 24 }) => {
  const iconProps = {
    className,
    style: { width: size, height: size }
  };

  switch (topic) {
    case TaskTopic.PHYSICAL_ACTIVITY:
      return <ActivityIcon {...iconProps} />;
    case TaskTopic.MENTAL_HEALTH:
      return <BrainIcon {...iconProps} />;
    case TaskTopic.EDUCATION:
      return <BookIcon {...iconProps} />;
    case TaskTopic.CREATIVITY:
      return <PaintbrushIcon {...iconProps} />;
    case TaskTopic.SOCIAL_SKILLS:
      return <MessageCircleIcon {...iconProps} />;
    case TaskTopic.HEALTHY_EATING:
      return <SaladIcon {...iconProps} />;
    case TaskTopic.PRODUCTIVITY:
      return <ClockIcon {...iconProps} />;
    case TaskTopic.EXPERIMENTS:
      return <FlaskRoundIcon {...iconProps} />;
    case TaskTopic.ECOLOGY:
      return <LeafIcon {...iconProps} />;
    case TaskTopic.TEAMWORK:
      return <HandshakeIcon {...iconProps} />;
    default:
      return <div className={className} style={{ width: size, height: size }}>❓</div>;
  }
};

export default TopicIcon;

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
      return <ActivityIcon {...iconProps} className={`${className} text-red-500`} />;
    case TaskTopic.MENTAL_HEALTH:
      return <BrainIcon {...iconProps} className={`${className} text-purple-500`} />;
    case TaskTopic.EDUCATION:
      return <BookIcon {...iconProps} className={`${className} text-blue-500`} />;
    case TaskTopic.CREATIVITY:
      return <PaintbrushIcon {...iconProps} className={`${className} text-pink-500`} />;
    case TaskTopic.SOCIAL_SKILLS:
      return <MessageCircleIcon {...iconProps} className={`${className} text-yellow-500`} />;
    case TaskTopic.HEALTHY_EATING:
      return <SaladIcon {...iconProps} className={`${className} text-lime-500`} />;
    case TaskTopic.PRODUCTIVITY:
      return <ClockIcon {...iconProps} className={`${className} text-orange-500`} />;
    case TaskTopic.EXPERIMENTS:
      return <FlaskRoundIcon {...iconProps} className={`${className} text-cyan-500`} />;
    case TaskTopic.ECOLOGY:
      return <LeafIcon {...iconProps} className={`${className} text-emerald-500`} />;
    case TaskTopic.TEAMWORK:
      return <HandshakeIcon {...iconProps} className={`${className} text-indigo-500`} />;
    default:
      return <div className={className} style={{ width: size, height: size }}>❓</div>;
  }
};

export default TopicIcon;

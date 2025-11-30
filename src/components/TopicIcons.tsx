import React from 'react';
import { ReactComponent as ActivityIcon } from '../assets/icons/activity.svg';
import { ReactComponent as BrainIcon } from '../assets/icons/brain.svg';
import { ReactComponent as BookIcon } from '../assets/icons/book.svg';
import { ReactComponent as PaintbrushIcon } from '../assets/icons/paintbrush.svg';
import { ReactComponent as MessageCircleIcon } from '../assets/icons/message-circle.svg';
import { ReactComponent as SaladIcon } from '../assets/icons/salad.svg';
import { ReactComponent as ClockIcon } from '../assets/icons/clock.svg';
import { ReactComponent as CompassIcon } from '../assets/icons/compass.svg';
import { ReactComponent as MusicIcon } from '../assets/icons/music.svg';
import { ReactComponent as GamepadIcon } from '../assets/icons/gamepad-2.svg';
import { ReactComponent as CodeIcon } from '../assets/icons/code.svg';
import { ReactComponent as LanguagesIcon } from '../assets/icons/languages.svg';
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
    case TaskTopic.CREATIVITY:
      return <PaintbrushIcon {...iconProps} className={`${className} text-pink-500`} />;
    case TaskTopic.SOCIAL_SKILLS:
      return <MessageCircleIcon {...iconProps} className={`${className} text-yellow-500`} />;
    case TaskTopic.NUTRITION:
      return <SaladIcon {...iconProps} className={`${className} text-lime-500`} />;
    case TaskTopic.PRODUCTIVITY:
      return <ClockIcon {...iconProps} className={`${className} text-orange-500`} />;
    case TaskTopic.ADVENTURE:
      return <CompassIcon {...iconProps} className={`${className} text-amber-500`} />;
    case TaskTopic.MUSIC:
      return <MusicIcon {...iconProps} className={`${className} text-violet-500`} />;
    case TaskTopic.BRAIN:
      return <BrainIcon {...iconProps} className={`${className} text-purple-500`} />;
    case TaskTopic.CYBERSPORT:
      return <GamepadIcon {...iconProps} className={`${className} text-green-500`} />;
    case TaskTopic.DEVELOPMENT:
      return <CodeIcon {...iconProps} className={`${className} text-blue-500`} />;
    case TaskTopic.READING:
      return <BookIcon {...iconProps} className={`${className} text-indigo-500`} />;
    case TaskTopic.LANGUAGE_LEARNING:
      return <LanguagesIcon {...iconProps} className={`${className} text-cyan-500`} />;
    default:
      return <div className={className} style={{ width: size, height: size }}>❓</div>;
  }
};

export default TopicIcon;

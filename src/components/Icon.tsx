import React from 'react';
import { ReactComponent as BrainIcon } from '../assets/icons/brain.svg';
import { ReactComponent as CoinsIcon } from '../assets/icons/coins.svg';
import { ReactComponent as CheckIcon } from '../assets/icons/check.svg';
import { ReactComponent as StarIcon } from '../assets/icons/star.svg';
import { ReactComponent as SettingsIcon } from '../assets/icons/settings.svg';
import { ReactComponent as TargetIcon } from '../assets/icons/target.svg';
import { ReactComponent as WrenchIcon } from '../assets/icons/wrench.svg';
import { ReactComponent as SwordIcon } from '../assets/icons/sword.svg';
import { ReactComponent as CalendarIcon } from '../assets/icons/calendar.svg';

export type IconType = 
  | 'brain' 
  | 'coins' 
  | 'check' 
  | 'star' 
  | 'settings' 
  | 'target' 
  | 'wrench' 
  | 'sword' 
  | 'calendar';

interface IconProps {
  type: IconType;
  className?: string;
  size?: number;
}

const Icon: React.FC<IconProps> = ({ type, className = '', size = 24 }) => {
  const iconProps = {
    className,
    style: { width: size, height: size }
  };

  switch (type) {
    case 'brain':
      return <BrainIcon {...iconProps} />;
    case 'coins':
      return <CoinsIcon {...iconProps} />;
    case 'check':
      return <CheckIcon {...iconProps} />;
    case 'star':
      return <StarIcon {...iconProps} />;
    case 'settings':
      return <SettingsIcon {...iconProps} />;
    case 'target':
      return <TargetIcon {...iconProps} />;
    case 'wrench':
      return <WrenchIcon {...iconProps} />;
    case 'sword':
      return <SwordIcon {...iconProps} />;
    case 'calendar':
      return <CalendarIcon {...iconProps} />;
    default:
      return <div className={className} style={{ width: size, height: size }}>❓</div>;
  }
};

export default Icon;

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
import { ReactComponent as HomeIcon } from '../assets/icons/home.svg';
import { ReactComponent as UserIcon } from '../assets/icons/user.svg';
import { ReactComponent as ClipboardIcon } from '../assets/icons/clipboard.svg';
import { ReactComponent as PlusIcon } from '../assets/icons/plus.svg';
import { ReactComponent as MinusIcon } from '../assets/icons/minus.svg';
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg';
import { ReactComponent as UsersIcon } from '../assets/icons/users.svg';
import { ReactComponent as TrophyIcon } from '../assets/icons/trophy.svg';
import { ReactComponent as CloudLightningIcon } from '../assets/icons/cloud-lightning.svg';
import { ReactComponent as TrendingUpIcon } from '../assets/icons/trending-up.svg';
import { ReactComponent as AwardIcon } from '../assets/icons/award.svg';

export type IconType = 
  | 'brain' 
  | 'coins' 
  | 'check' 
  | 'star' 
  | 'settings' 
  | 'target' 
  | 'wrench' 
  | 'sword' 
  | 'calendar'
  | 'home'
  | 'user'
  | 'clipboard'
  | 'plus'
  | 'minus'
  | 'search'
  | 'users'
  | 'trophy'
  | 'cloud-lightning'
  | 'trending-up'
  | 'award';

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
    case 'home':
      return <HomeIcon {...iconProps} />;
    case 'user':
      return <UserIcon {...iconProps} />;
    case 'clipboard':
      return <ClipboardIcon {...iconProps} />;
    case 'plus':
      return <PlusIcon {...iconProps} />;
    case 'minus':
      return <MinusIcon {...iconProps} />;
    case 'search':
      return <SearchIcon {...iconProps} />;
    case 'users':
      return <UsersIcon {...iconProps} />;
    case 'trophy':
      return <TrophyIcon {...iconProps} />;
    case 'cloud-lightning':
      return <CloudLightningIcon {...iconProps} />;
    case 'trending-up':
      return <TrendingUpIcon {...iconProps} />;
    case 'award':
      return <AwardIcon {...iconProps} />;
    default:
      return <div className={className} style={{ width: size, height: size }}>❓</div>;
  }
};

export default Icon;

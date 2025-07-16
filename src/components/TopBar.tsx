import React from 'react';

type TopBarProps = {
  title: string;
  onHamburgerClick: () => void;
  hamburgerOpen: boolean;
};

const TopBar: React.FC<TopBarProps> = ({ title, onHamburgerClick, hamburgerOpen }) => (
  <div className="top-bar">
    <div className="topbar-hamburger">
      <button className="icon-btn" aria-label="Меню" onClick={onHamburgerClick}>
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="6" width="28" height="3.2" rx="1.6" fill="#4f8cff" />
          <rect y="12.4" width="28" height="3.2" rx="1.6" fill="#4f8cff" />
          <rect y="18.8" width="28" height="3.2" rx="1.6" fill="#4f8cff" />
        </svg>
      </button>
    </div>
    <div className="top-bar-title">{title}</div>
  </div>
);

export default TopBar; 
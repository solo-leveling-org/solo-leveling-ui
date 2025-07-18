import React from 'react';

type TopBarProps = {
  title: string;
  onHamburgerClick: () => void;
  hamburgerOpen: boolean;
};

const TopBar: React.FC<TopBarProps> = ({ title, onHamburgerClick, hamburgerOpen }) => (
  <div className="sticky top-0 z-50 w-full h-[64px] bg-white shadow-[0_2px_12px_rgba(0,0,0,0.07)] flex items-center px-4 md:px-8">
    <div className="mr-4 flex items-center">
      <button
        className="w-11 h-11 flex items-center justify-center rounded-xl border-2 border-transparent hover:border-blue-400 focus:border-blue-400 transition-colors bg-white shadow-md"
        aria-label="Меню"
        onClick={onHamburgerClick}
        type="button"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="6" width="28" height="3.2" rx="1.6" fill="#4f8cff" />
          <rect y="12.4" width="28" height="3.2" rx="1.6" fill="#4f8cff" />
          <rect y="18.8" width="28" height="3.2" rx="1.6" fill="#4f8cff" />
        </svg>
      </button>
    </div>
    <div className="text-xl font-bold text-[#222] truncate">{title}</div>
  </div>
);

export default TopBar; 
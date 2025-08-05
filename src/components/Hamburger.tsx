import React from 'react';

type HamburgerProps = {
  open: boolean;
  onClick: () => void;
};

const Hamburger: React.FC<HamburgerProps> = ({ open, onClick }) => (
  <button
    className={
      `fixed top-4.5 left-4.5 z-[1002] w-11 h-11 bg-white border-2 border-[#f0f4fa] rounded-xl shadow-md flex flex-col justify-center items-center gap-1.5 cursor-pointer transition-shadow duration-200
      ${open ? 'border-blue-500 shadow-lg' : ''}`
    }
    aria-label="Open menu"
    aria-pressed={open}
    onClick={onClick}
    type="button"
  >
    <span className="block w-6 h-[3.2px] bg-blue-500 rounded transition-all duration-200" />
    <span className="block w-6 h-[3.2px] bg-blue-500 rounded transition-all duration-200" />
    <span className="block w-6 h-[3.2px] bg-blue-500 rounded transition-all duration-200" />
  </button>
);

export default Hamburger;
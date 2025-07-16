import React from 'react';

type HamburgerProps = {
  open: boolean;
  onClick: () => void;
};

const Hamburger: React.FC<HamburgerProps> = ({ open, onClick }) => (
  <button className="hamburger" aria-label="Open menu" aria-pressed={open} onClick={onClick}>
    <span />
    <span />
    <span />
  </button>
);

export default Hamburger; 
import React from 'react';

type Tab = {
  label: string;
  active: boolean;
  onClick: () => void;
};

type SideDrawerProps = {
  open: boolean;
  tabs: Tab[];
  onClose: () => void;
};

const SideDrawer: React.FC<SideDrawerProps> = ({ open, tabs, onClose }) => (
  <>
    <nav className={`side-drawer${open ? ' open' : ''}`}>
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={`tab-btn${tab.active ? ' active' : ''}`}
          onClick={tab.onClick}
        >
          {tab.label}
        </button>
      ))}
    </nav>
    <div className={`drawer-backdrop${open ? ' show' : ''}`} onClick={onClose} />
  </>
);

export default SideDrawer; 
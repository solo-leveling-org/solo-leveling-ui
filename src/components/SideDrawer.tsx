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
    <nav
      className={`fixed top-0 left-0 w-[82vw] max-w-[340px] h-full bg-white shadow-[2px_0_32px_rgba(0,0,0,0.13)] rounded-tr-[28px] rounded-br-[28px] z-[1001] flex flex-col pt-[60px] gap-2 transition-transform duration-250 ease-[cubic-bezier(.4,0,.2,1)] ${open ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab.label}
          className={`w-[90%] mx-auto mb-2.5 last:mb-2.5 py-[1.15rem] pl-[2.2rem] bg-none border-none text-[1.13rem] font-medium text-[#888] text-left rounded-2xl transition-colors duration-200 outline-none box-border relative block ${tab.active ? 'text-[#222] bg-gradient-to-r from-[#eaf1ff] to-[#f7f8fa] shadow-md' : 'hover:bg-[#f0f4fa] hover:text-blue-500'} ${tab.active ? '' : ''}`}
          style={tab.active ? { boxShadow: '0 2px 8px rgba(79,140,255,0.07)' } : {}}
          onClick={tab.onClick}
        >
          {tab.label}
        </button>
      ))}
    </nav>
    <div
      className={`fixed inset-0 bg-[rgba(79,140,255,0.08)] z-[1000] transition-opacity duration-200 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
    />
  </>
);

export default SideDrawer; 
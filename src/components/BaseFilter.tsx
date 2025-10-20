import React, { useState, useRef, useEffect } from 'react';
import BottomSheet from './BottomSheet';

interface BaseFilterProps {
  label: string;
  displayText: string;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  hasValue?: boolean;
  onClear?: () => void;
}

const BaseFilter: React.FC<BaseFilterProps> = ({
  label,
  displayText,
  isOpen,
  onToggle,
  onClose,
  children,
  className = '',
  hasValue = false,
  onClear
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasValue && onClear) {
      onClear();
    } else {
      onToggle();
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Кнопка фильтра - современный дизайн */}
       <button
         onClick={onToggle}
         className="w-full max-w-fit flex items-center px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 select-none shadow-sm"
       >
         <span className="text-sm font-medium text-gray-800 truncate select-none" data-text="true">
           {displayText}
         </span>
         <div className="ml-2 flex-shrink-0">
           {hasValue ? (
             <button
               onClick={handleIconClick}
               className="w-4 h-4 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
             >
               <svg className="w-2.5 h-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
           ) : (
             <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
             </svg>
           )}
         </div>
       </button>

      {/* Всплывающее окно */}
      <BottomSheet
        isOpen={isOpen}
        onClose={onClose}
        title={label}
      >
        {children}
      </BottomSheet>
    </div>
  );
};

export default BaseFilter;

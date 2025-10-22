import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import Calendar from './Calendar';

interface DateFilterProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  className?: string;
}

const DateFilter: React.FC<DateFilterProps> = ({
  from,
  to,
  onChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFrom, setSelectedFrom] = useState<string>(from);
  const [selectedTo, setSelectedTo] = useState<string>(to);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLocalization();

  useEffect(() => {
    setSelectedFrom(from);
    setSelectedTo(to);
  }, [from, to]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getDisplayText = () => {
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      return `${fromDate.toLocaleDateString('ru-RU')} - ${toDate.toLocaleDateString('ru-RU')}`;
    }
    return t('balance.filters.period');
  };

  const hasValue = !!(from && to);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };


  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Кнопка фильтра */}
      <button
        onClick={handleToggle}
        className="w-full max-w-fit flex items-center px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 select-none shadow-sm"
      >
        <span className="text-sm font-medium text-gray-800 truncate select-none" data-text="true">
          {getDisplayText()}
        </span>
        <div className="ml-2 flex-shrink-0">
          {hasValue ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setSelectedFrom('');
                setSelectedTo('');
                onChange('', '');
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="w-4 h-4 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200 cursor-pointer"
              style={{ pointerEvents: 'auto' }}
            >
              <svg className="w-2.5 h-2.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <svg className={`w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
      </button>

      {/* Calendar Component */}
      <Calendar
        selectedFrom={selectedFrom}
        selectedTo={selectedTo}
        onDateSelect={(from, to) => {
          setSelectedFrom(from);
          setSelectedTo(to);
          if (from && to) {
            onChange(from, to);
          }
        }}
        onClose={handleClose}
        isOpen={isOpen}
      />
    </div>
  );
};

export default DateFilter;

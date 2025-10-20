import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';

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
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<string | null>(null);
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

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!selectedFrom || !selectedTo) return false;
    const dateStr = formatDate(date);
    return dateStr > selectedFrom && dateStr < selectedTo;
  };

  const isDateSelected = (date: Date) => {
    const dateStr = formatDate(date);
    return dateStr === selectedFrom || dateStr === selectedTo;
  };

  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);

    if (!selectedFrom || (selectedFrom && selectedTo)) {
      setSelectedFrom(dateStr);
      setSelectedTo('');
    } else if (selectedFrom && !selectedTo) {
      if (dateStr < selectedFrom) {
        setSelectedTo(selectedFrom);
        setSelectedFrom(dateStr);
      } else {
        setSelectedTo(dateStr);
      }
    }
  };

  const handleApply = () => {
    if (selectedFrom && selectedTo) {
      onChange(selectedFrom, selectedTo);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSelectedFrom('');
    setSelectedTo('');
    onChange('', '');
    setIsOpen(false);
  };

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

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    t('common.months.january'), t('common.months.february'), t('common.months.march'),
    t('common.months.april'), t('common.months.may'), t('common.months.june'),
    t('common.months.july'), t('common.months.august'), t('common.months.september'),
    t('common.months.october'), t('common.months.november'), t('common.months.december')
  ];

  const dayNames = [
    t('common.days.monday'), t('common.days.tuesday'), t('common.days.wednesday'),
    t('common.days.thursday'), t('common.days.friday'), t('common.days.saturday'),
    t('common.days.sunday')
  ];

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
                e.stopPropagation();
                handleClear();
              }}
              className="w-4 h-4 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
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

      {/* Inline Calendar Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 z-[9998]"
            onClick={handleClose}
          />
          
          {/* Calendar Modal */}
          <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 w-[calc(100vw-2rem)] max-w-[450px] sm:min-w-[400px] sm:w-auto select-none">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl -translate-y-4 translate-x-4"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-400/20 to-emerald-400/20 rounded-full blur-lg translate-y-2 -translate-x-2"></div>
          
          <div className="relative z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 select-none">{t('balance.filters.selectPeriod')}</h3>
              <button
                onClick={handleClose}
                className="w-8 h-8 bg-gray-100/50 rounded-full flex items-center justify-center hover:bg-gray-200/50 transition-colors select-none"
              >
                ✕
              </button>
            </div>

            {/* Month Navigation */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors select-none"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h4 className="text-lg font-semibold text-gray-800 select-none">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h4>
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors select-none"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-0 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1 select-none">
                  {day.slice(0, 3)}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0 mb-4">
              {days.map((day, index) => {
                if (!day) {
                  return <div key={index} className="aspect-square" style={{ minHeight: '32px', minWidth: '32px' }}></div>;
                }

                const dateStr = formatDate(day);
                const isSelected = isDateSelected(day);
                const isInRange = isDateInRange(day);
                const isHovered = hoverDate === dateStr;

                return (
                  <button
                    key={dateStr}
                    onClick={() => handleDateClick(day)}
                    onMouseEnter={() => setHoverDate(dateStr)}
                    onMouseLeave={() => setHoverDate(null)}
                    className={`
                      aspect-square rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-105 sm:hover:scale-110 cursor-pointer relative select-none
                      ${isSelected 
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg z-10' 
                        : isInRange 
                          ? 'bg-gradient-to-r from-emerald-200 to-teal-200 text-emerald-800 relative' 
                          : isHovered
                            ? 'bg-gray-100 text-gray-800'
                            : 'text-gray-700 hover:bg-gray-50'
                      }
                    `}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minHeight: '32px',
                      minWidth: '32px'
                    }}
                  >
                    {day.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleClear}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors select-none"
              >
                {t('common.clear')}
              </button>
              <button
                onClick={handleApply}
                disabled={!selectedFrom || !selectedTo}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 select-none"
              >
                {t('common.apply')}
              </button>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default DateFilter;

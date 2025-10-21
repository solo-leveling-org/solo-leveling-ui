import React, { useState, useRef, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface CalendarProps {
  selectedFrom: string;
  selectedTo: string;
  onDateSelect: (from: string, to: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

const Calendar: React.FC<CalendarProps> = ({
  selectedFrom: initialSelectedFrom,
  selectedTo: initialSelectedTo,
  onDateSelect,
  onClose,
  isOpen
}) => {
  const [selectedFrom, setSelectedFrom] = useState<string>(initialSelectedFrom);
  const [selectedTo, setSelectedTo] = useState<string>(initialSelectedTo);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const { t } = useLocalization();

  // Синхронизируем с внешними значениями
  useEffect(() => {
    setSelectedFrom(initialSelectedFrom);
    setSelectedTo(initialSelectedTo);
  }, [initialSelectedFrom, initialSelectedTo]);

  // Анимация открытия/закрытия
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isOpen]);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
    }
  }, [isOpen, onClose]);

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
        setSelectedFrom(dateStr);
        setSelectedTo(selectedFrom);
      } else {
        setSelectedTo(dateStr);
      }
    }
  };

  const handleApply = () => {
    if (selectedFrom && selectedTo) {
      onDateSelect(selectedFrom, selectedTo);
      onClose();
    }
  };

  const handleClear = () => {
    setSelectedFrom('');
    setSelectedTo('');
    onDateSelect('', '');
    onClose();
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

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 z-[9998] ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transition: 'opacity 0.3s ease-out'
        }}
        onClick={onClose}
      />
      
      {/* Calendar Modal */}
      <div 
        ref={calendarRef}
        className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9999] bg-white rounded-2xl shadow-2xl border border-gray-200 p-3 w-[calc(100vw-2rem)] max-w-[450px] sm:min-w-[400px] sm:w-auto select-none ${
          isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        style={{
          transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease-out'
        }}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-xl -translate-y-4 translate-x-4"></div>
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-400/20 to-emerald-400/20 rounded-full blur-lg translate-y-2 -translate-x-2"></div>
        
        <div className="relative z-10">
          {/* Header */}
          <div className={`flex items-center justify-between mb-6 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} style={{ 
            transition: isVisible ? 'transform 0.3s ease-out 0.1s, opacity 0.3s ease-out 0.1s' : 'transform 0.2s ease-in, opacity 0.2s ease-in'
          }}>
            <h3 className="text-lg font-bold text-gray-800 select-none">{t('balance.filters.selectPeriod')}</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 bg-gray-100/50 rounded-full flex items-center justify-center hover:bg-gray-200/50 transition-colors select-none"
            >
              ✕
            </button>
          </div>

          {/* Month Navigation */}
          <div className={`flex items-center justify-between mb-4 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} style={{ 
            transition: isVisible ? 'transform 0.3s ease-out 0.15s, opacity 0.3s ease-out 0.15s' : 'transform 0.2s ease-in, opacity 0.2s ease-in'
          }}>
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
          <div className={`grid grid-cols-7 gap-0 mb-2 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} style={{ 
            transition: isVisible ? 'transform 0.3s ease-out 0.2s, opacity 0.3s ease-out 0.2s' : 'transform 0.2s ease-in, opacity 0.2s ease-in'
          }}>
            {dayNames.map((day) => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1 select-none">
                {day.slice(0, 3)}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className={`grid grid-cols-7 gap-0 mb-4 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} style={{ 
            transition: isVisible ? 'transform 0.3s ease-out 0.25s, opacity 0.3s ease-out 0.25s' : 'transform 0.2s ease-in, opacity 0.2s ease-in'
          }}>
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
          <div className={`flex space-x-3 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`} style={{ 
            transition: isVisible ? 'transform 0.3s ease-out 0.3s, opacity 0.3s ease-out 0.3s' : 'transform 0.2s ease-in, opacity 0.2s ease-in'
          }}>
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
  );
};

export default Calendar;

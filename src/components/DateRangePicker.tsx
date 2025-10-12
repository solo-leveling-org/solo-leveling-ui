import React, { useState, useEffect } from 'react';
import { useLocalization } from '../hooks/useLocalization';

interface DateRangePickerProps {
  from: string;
  to: string;
  onChange: (from: string, to: string) => void;
  className?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
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
  const { t } = useLocalization();

  useEffect(() => {
    setSelectedFrom(from);
    setSelectedTo(to);
  }, [from, to]);

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Добавляем пустые ячейки для начала месяца
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Добавляем дни месяца
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const isDateInRange = (date: Date) => {
    if (!selectedFrom || !selectedTo) return false;
    const dateStr = formatDate(date);
    return dateStr >= selectedFrom && dateStr <= selectedTo;
  };

  const isDateSelected = (date: Date) => {
    const dateStr = formatDate(date);
    return dateStr === selectedFrom || dateStr === selectedTo;
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date: Date) => {
    const dateStr = formatDate(date);
    
    if (isDateDisabled(date)) return;

    if (!selectedFrom || (selectedFrom && selectedTo)) {
      // Начинаем новый выбор
      setSelectedFrom(dateStr);
      setSelectedTo('');
    } else if (selectedFrom && !selectedTo) {
      // Завершаем выбор
      if (dateStr < selectedFrom) {
        // Если выбрали дату раньше from, меняем местами
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
    if (selectedFrom && selectedTo) {
      return `${selectedFrom} - ${selectedTo}`;
    } else if (selectedFrom) {
      return `${selectedFrom} - ...`;
    }
    return t('common.selectDateRange');
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
    <div className={`relative ${className}`}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/80 transition-all duration-300 hover:scale-105 text-left flex items-center justify-between"
      >
        <span className="text-gray-700 font-medium">{getDisplayText()}</span>
        <div className="text-2xl">📅</div>
      </button>

      {/* Calendar Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Calendar */}
          <div className="absolute top-full left-0 mt-2 z-50 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-4 w-full max-w-[calc(100vw-2rem)] sm:min-w-[320px] sm:w-auto">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-xl -translate-y-4 translate-x-4"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-lg translate-y-2 -translate-x-2"></div>
            
            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">{t('common.selectDateRange')}</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 bg-gray-100/50 rounded-full flex items-center justify-center hover:bg-gray-200/50 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  className="w-8 h-8 bg-white/60 rounded-full flex items-center justify-center hover:bg-white/80 transition-colors"
                >
                  ←
                </button>
                <h4 className="text-lg font-semibold text-gray-800">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h4>
                <button
                  onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  className="w-8 h-8 bg-white/60 rounded-full flex items-center justify-center hover:bg-white/80 transition-colors"
                >
                  →
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-0.5 mb-2">
                {dayNames.map((day) => (
                  <div key={day} className="text-center text-xs font-semibold text-gray-500 py-1">
                    {day.slice(0, 3)}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-0.5 mb-4">
                {days.map((day, index) => {
                  if (!day) {
                    return <div key={index} className="h-8 sm:h-10"></div>;
                  }

                  const dateStr = formatDate(day);
                  const isSelected = isDateSelected(day);
                  const isInRange = isDateInRange(day);
                  const isDisabled = isDateDisabled(day);
                  const isHovered = hoverDate === dateStr;

                  return (
                    <button
                      key={dateStr}
                      onClick={() => handleDateClick(day)}
                      onMouseEnter={() => setHoverDate(dateStr)}
                      onMouseLeave={() => setHoverDate(null)}
                      disabled={isDisabled}
                      className={`
                        h-8 w-8 sm:h-10 sm:w-10 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-200
                        ${isDisabled 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'hover:scale-105 sm:hover:scale-110 cursor-pointer'
                        }
                        ${isSelected 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                          : isInRange 
                            ? 'bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700' 
                            : isHovered
                              ? 'bg-gray-100 text-gray-800'
                              : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
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
                  className="flex-1 px-4 py-2 bg-gray-100/60 text-gray-700 rounded-xl font-medium hover:bg-gray-200/60 transition-colors"
                >
                  {t('common.clear')}
                </button>
                <button
                  onClick={handleApply}
                  disabled={!selectedFrom || !selectedTo}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
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

export default DateRangePicker;

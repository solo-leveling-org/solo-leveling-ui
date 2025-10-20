import React, { useState } from 'react';
import BottomSheet from './BottomSheet';
import DateRangePicker from './DateRangePicker';

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

  const getDisplayText = () => {
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      return `${fromDate.toLocaleDateString('ru-RU')} - ${toDate.toLocaleDateString('ru-RU')}`;
    }
    return 'Период';
  };

  const handleDateChange = (newFrom: string, newTo: string) => {
    onChange(newFrom, newTo);
    if (newFrom && newTo) {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Кнопка фильтра дат */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 select-none"
      >
        <span className="text-sm font-medium text-gray-700 truncate select-none" data-text="true">
          {getDisplayText()}
        </span>
        <span className="text-gray-500 transition-transform duration-200 text-xs select-none">
          ▼
        </span>
      </button>

      {/* Всплывающее окно с DateRangePicker */}
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Выберите период"
      >
        <div className="space-y-4">
          <DateRangePicker
            from={from}
            to={to}
            onChange={handleDateChange}
            className="w-full"
          />
        </div>
      </BottomSheet>
    </div>
  );
};

export default DateFilter;

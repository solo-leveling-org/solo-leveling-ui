import React, { useState } from 'react';
import BottomSheet from './BottomSheet';
import DateRangePicker from './DateRangePicker';
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
  const { t } = useLocalization();

  const getDisplayText = () => {
    if (from && to) {
      const fromDate = new Date(from);
      const toDate = new Date(to);
      return `${fromDate.toLocaleDateString('ru-RU')} - ${toDate.toLocaleDateString('ru-RU')}`;
    }
    return t('balance.filters.period');
  };

  const handleDateChange = (newFrom: string, newTo: string) => {
    onChange(newFrom, newTo);
    if (newFrom && newTo) {
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Кнопка фильтра дат - современный дизайн */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 select-none shadow-sm"
      >
        <span className="text-sm font-medium text-gray-800 truncate select-none mr-3" data-text="true">
          {getDisplayText()}
        </span>
        <svg className="w-4 h-4 text-gray-500 transition-transform duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Всплывающее окно с DateRangePicker */}
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={t('balance.filters.selectPeriod')}
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

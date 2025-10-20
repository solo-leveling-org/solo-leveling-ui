import React, { useState } from 'react';
import BaseFilter from './BaseFilter';
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

  const hasValue = !!(from && to);

  const handleClear = () => {
    onChange('', '');
  };

  const handleDateChange = (newFrom: string, newTo: string) => {
    onChange(newFrom, newTo);
    if (newFrom && newTo) {
      setIsOpen(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <BaseFilter
      label={t('balance.filters.selectPeriod')}
      displayText={getDisplayText()}
      isOpen={isOpen}
      onToggle={handleToggle}
      onClose={handleClose}
      className={className}
      hasValue={hasValue}
      onClear={handleClear}
    >
      <div className="space-y-4">
        <DateRangePicker
          from={from}
          to={to}
          onChange={handleDateChange}
          className="w-full"
        />
      </div>
    </BaseFilter>
  );
};

export default DateFilter;

import React, { useState } from 'react';
import BaseFilter from './BaseFilter';
import { useLocalization } from '../hooks/useLocalization';

interface FilterOption {
  name: string;
  localization: string;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  className?: string;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  options,
  selectedValues,
  onSelectionChange,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLocalization();

  const handleOptionClick = (optionName: string) => {
    const isSelected = selectedValues.includes(optionName);
    const newValues = isSelected
      ? selectedValues.filter(v => v !== optionName)
      : [...selectedValues, optionName];
    onSelectionChange(newValues);
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return label;
    }
    if (selectedValues.length === 1) {
      const option = options.find(opt => opt.name === selectedValues[0]);
      return option?.localization || selectedValues[0];
    }
    return `${selectedValues.length} ${t('balance.filters.selected')}`;
  };

  const hasValue = selectedValues.length > 0;

  const handleClear = () => {
    onSelectionChange([]);
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <BaseFilter
      label={label}
      displayText={getDisplayText()}
      isOpen={isOpen}
      onToggle={handleToggle}
      onClose={handleClose}
      className={className}
      hasValue={hasValue}
      onClear={handleClear}
    >
      <div className="space-y-0">
        {options.map((option, index) => {
          const isSelected = selectedValues.includes(option.name);
          return (
            <button
              key={option.name}
              onClick={() => handleOptionClick(option.name)}
              className={`w-full flex items-center justify-between px-4 py-4 text-left hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0 select-none ${
                isSelected ? 'bg-blue-50' : ''
              }`}
            >
              <span className="text-base font-medium text-gray-700 select-text" data-text="true">
                {option.localization}
              </span>
              {isSelected && (
                <span className="text-blue-600 text-lg select-none">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </BaseFilter>
  );
};

export default FilterDropdown;

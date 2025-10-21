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
      <div className="space-y-2 p-2">
        {options.map((option, index) => {
          const isSelected = selectedValues.includes(option.name);
          return (
            <button
              key={option.name}
              onClick={() => handleOptionClick(option.name)}
              className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-xl transition-all duration-200 select-none group ${
                isSelected 
                  ? 'bg-emerald-50 border-2 border-emerald-200 shadow-sm' 
                  : 'bg-white border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              <span className={`text-base font-medium select-text transition-colors duration-200 ${
                isSelected ? 'text-emerald-900' : 'text-gray-700 group-hover:text-gray-900'
              }`} data-text="true">
                {option.localization}
              </span>
              {isSelected && (
                <div className="w-5 h-5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </BaseFilter>
  );
};

export default FilterDropdown;

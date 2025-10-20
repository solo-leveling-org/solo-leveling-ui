import React, { useState, useRef, useEffect } from 'react';
import BottomSheet from './BottomSheet';

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
  const dropdownRef = useRef<HTMLDivElement>(null);

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
    return `${selectedValues.length} выбрано`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Кнопка фильтра */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 border border-gray-200 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 select-none"
      >
        <span className="text-sm font-medium text-gray-700 truncate select-none" data-text="true">
          {getDisplayText()}
        </span>
        <span className={`text-gray-500 transition-transform duration-200 text-xs select-none ${isOpen ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {/* Всплывающее окно */}
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={label}
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
      </BottomSheet>
    </div>
  );
};

export default FilterDropdown;

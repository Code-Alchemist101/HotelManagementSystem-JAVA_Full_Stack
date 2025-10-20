import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search...',
  debounce = 300,
  className = '',
  showClearButton = true,
  autoFocus = false,
  disabled = false,
  size = 'md'
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (onChange) {
        onChange(localValue);
      }
    }, debounce);

    return () => clearTimeout(timer);
  }, [localValue, onChange, debounce]);

  const handleChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleClear = () => {
    setLocalValue('');
    if (onClear) {
      onClear();
    }
    if (onChange) {
      onChange('');
    }
  };

  const sizes = {
    sm: 'h-9 text-sm',
    md: 'h-10 text-base',
    lg: 'h-12 text-lg'
  };

  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
        
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          autoFocus={autoFocus}
          disabled={disabled}
          className={`
            w-full pl-10 pr-10 border border-gray-300 rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all duration-200
            disabled:bg-gray-100 disabled:cursor-not-allowed
            placeholder:text-gray-400
            ${sizeClass}
          `}
        />

        {showClearButton && localValue && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            aria-label="Clear search"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Advanced search bar with filters
export const AdvancedSearchBar = ({
  value,
  onChange,
  filters = [],
  selectedFilter,
  onFilterChange,
  placeholder = 'Search...',
  className = ''
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {filters.length > 0 && (
        <select
          value={selectedFilter}
          onChange={(e) => onFilterChange && onFilterChange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          {filters.map((filter) => (
            <option key={filter.value} value={filter.value}>
              {filter.label}
            </option>
          ))}
        </select>
      )}
      
      <SearchBar
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="flex-1"
      />
    </div>
  );
};

export default SearchBar;
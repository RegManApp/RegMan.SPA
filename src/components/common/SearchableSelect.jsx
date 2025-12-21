
import React, { useState, useMemo, useRef, useEffect } from 'react';

const SearchableSelect = ({
  label,
  options,
  value,
  onChange,
  error,
  required,
  placeholder = 'Select...',
  getOptionLabel,
  getOptionValue,
  disabled,
  ...props
}) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Find selected option label
  const selectedOption = options.find(opt => String(getOptionValue(opt)) === String(value));
  useEffect(() => {
    if (selectedOption && !open) {
      setSearch(getOptionLabel(selectedOption));
    }
    if (!selectedOption && !open) {
      setSearch('');
    }
    // eslint-disable-next-line
  }, [value, open]);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter(opt =>
      getOptionLabel(opt).toLowerCase().includes(search.toLowerCase())
    );
  }, [search, options, getOptionLabel]);

  // Keyboard navigation
  const [highlighted, setHighlighted] = useState(0);
  useEffect(() => {
    setHighlighted(0);
  }, [search, open]);

  const handleInputKeyDown = (e) => {
    if (!open && (e.key === 'ArrowDown' || e.key === 'Enter')) {
      setOpen(true);
      return;
    }
    if (open) {
      if (e.key === 'ArrowDown') {
        setHighlighted(h => Math.min(h + 1, filteredOptions.length - 1));
      } else if (e.key === 'ArrowUp') {
        setHighlighted(h => Math.max(h - 1, 0));
      } else if (e.key === 'Enter') {
        if (filteredOptions[highlighted]) {
          handleSelect(filteredOptions[highlighted]);
        }
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }
  };

  const handleSelect = (option) => {
    setOpen(false);
    setSearch(getOptionLabel(option));
    onChange({
      target: {
        name: props.name,
        value: getOptionValue(option),
      },
    });
  };

  // Click outside to close
  useEffect(() => {
    const handleClick = (e) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(e.target) &&
        listRef.current &&
        !listRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="w-full relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        ref={inputRef}
        type="text"
        className={`block w-full rounded-lg border px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary-500 ${error ? 'border-red-300' : ''}`}
        placeholder={placeholder}
        value={open ? search : (selectedOption ? getOptionLabel(selectedOption) : '')}
        onChange={e => {
          setSearch(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 100)}
        onKeyDown={handleInputKeyDown}
        autoComplete="off"
        disabled={disabled}
        name={props.name}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-controls={`searchable-select-list-${props.name}`}
        aria-activedescendant={open && filteredOptions[highlighted] ? `option-${getOptionValue(filteredOptions[highlighted])}` : undefined}
        {...props}
      />
      {open && filteredOptions.length > 0 && (
        <ul
          ref={listRef}
          id={`searchable-select-list-${props.name}`}
          className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg mt-1 max-h-56 overflow-auto shadow-lg"
          role="listbox"
        >
          {filteredOptions.map((opt, idx) => (
            <li
              key={getOptionValue(opt)}
              id={`option-${getOptionValue(opt)}`}
              className={`px-4 py-2 cursor-pointer ${idx === highlighted ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300' : ''}`}
              onMouseDown={() => handleSelect(opt)}
              onMouseEnter={() => setHighlighted(idx)}
              role="option"
              aria-selected={value === getOptionValue(opt)}
            >
              {getOptionLabel(opt)}
            </li>
          ))}
        </ul>
      )}
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

SearchableSelect.defaultProps = {
  getOptionLabel: opt => opt.label || opt.name || '',
  getOptionValue: opt => opt.value || opt.id || '',
};

export default SearchableSelect;

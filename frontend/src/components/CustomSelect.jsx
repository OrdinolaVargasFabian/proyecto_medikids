import { useState, useRef, useEffect } from 'react';

const Chevron = ({ open }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16" height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`shrink-0 text-gray-400 transition-transform duration-200 ${open ? 'rotate-180 text-medi-500' : ''}`}
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Seleccionar',
  className = '',
  disabled = false,
  optionHeight = 'py-2.5',
  optionFont = 'text-sm',
  dataTutorial,
}) {
  const [open, setOpen] = useState(false);
  const [placeAbove, setPlaceAbove] = useState(false);
  const ref = useRef(null);
  const btnRef = useRef(null);
  const listRef = useRef(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  const handleChange = (val) => {
    onChange(val);
    if (ref.current) {
      ref.current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    if (!open) setActiveIdx(-1);
  }, [open]);

  useEffect(() => {
    if (!open || !listRef.current) return;
    const el = listRef.current.children[activeIdx];
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [activeIdx, open]);

  const selectedOption = options.find((o) => o.value === value);
  const displayLabel = selectedOption?.label || placeholder;
  const isEmpty = !selectedOption;

  const toggleOpen = () => {
    if (disabled) return;
    if (open) {
      setOpen(false);
      return;
    }
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const listHeight = Math.min(options.length * 40 + 8, 224);
      const spaceBelow = window.innerHeight - rect.bottom;
      setPlaceAbove(spaceBelow < listHeight && rect.top > listHeight);
    }
    setOpen(true);
  };

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setOpen(true);
        setActiveIdx(0);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((prev) => Math.min(prev + 1, options.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (activeIdx >= 0 && activeIdx < options.length) {
        handleChange(options[activeIdx].value);
        setOpen(false);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative" onKeyDown={handleKeyDown} data-tutorial={dataTutorial} data-open={open ? "true" : "false"}>
      <button
        ref={btnRef}
        type="button"
        disabled={disabled}
        onClick={toggleOpen}
        className={`w-full flex items-center justify-between gap-2 text-left ${className} ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <span className={`truncate ${isEmpty ? 'text-gray-400' : ''}`}>
          {displayLabel}
        </span>
        <Chevron open={open} />
      </button>

      {open && (
        <div className={`absolute z-50 w-full bg-white border border-gray-200 rounded-xl shadow-xl animate-[fadeIn_0.15s_ease-out] overflow-hidden ${placeAbove ? 'bottom-full mb-1.5' : 'mt-1.5'}`}>
          <ul
            ref={listRef}
            className="max-h-56 overflow-y-auto overscroll-contain py-1"
            role="listbox"
            onWheel={(e) => e.stopPropagation()}
          >
            {placeholder && (
              <li
                role="option"
                aria-selected={isEmpty}
                onClick={() => { handleChange(''); setOpen(false); }}
                className={`${optionFont} ${optionHeight} px-4 font-medium cursor-pointer transition-colors ${
                  isEmpty
                    ? 'bg-medi-50 text-medi-700'
                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                }`}
              >
                {placeholder}
              </li>
            )}
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isActive = idx === activeIdx;
              return (
                <li
                  key={opt.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => { handleChange(opt.value); setOpen(false); }}
                  className={`${optionFont} ${optionHeight} px-4 font-medium cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-medi-50 text-medi-700'
                      : isActive
                        ? 'bg-gray-50 text-gray-900'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {opt.label}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export default CustomSelect;

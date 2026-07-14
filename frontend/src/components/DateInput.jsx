import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
];

const DAYS = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

const toInputFormat = (iso) => {
  if (!iso) return '';
  const parts = iso.split('-');
  if (parts.length !== 3) return iso;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
};

const toIsoFormat = (display) => {
  const digits = display.replace(/\D/g, '');
  if (digits.length !== 8) return '';
  const dd = digits.slice(0, 2);
  const mm = digits.slice(2, 4);
  const yyyy = digits.slice(4, 8);
  return `${yyyy}-${mm}-${dd}`;
};

const formatDisplay = (digits) => {
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
};

const isValidDate = (iso) => {
  if (!iso || iso.length !== 10) return false;
  const d = new Date(iso + 'T00:00:00');
  return !isNaN(d.getTime());
};

const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
const firstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

export function DateInput({ value, onChange, min, max, className = '', placeholder = 'DD/MM/AAAA', required = false }) {
  const [display, setDisplay] = useState(() => toInputFormat(value));
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [calendarPos, setCalendarPos] = useState({ top: 0, left: 0 });
  const [placeAbove, setPlaceAbove] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [yearPage, setYearPage] = useState(0);
  const ref = useRef(null);
  const inputRef = useRef(null);

  const today = new Date();
  const currentYear = today.getFullYear();
  const minYear = min ? parseInt(min.split('-')[0]) : currentYear - 100;

  const [viewYear, setViewYear] = useState(() => {
    if (value && isValidDate(value)) return new Date(value + 'T00:00:00').getFullYear();
    return currentYear;
  });
  const [viewMonth, setViewMonth] = useState(() => {
    if (value && isValidDate(value)) return new Date(value + 'T00:00:00').getMonth();
    return today.getMonth();
  });

  useEffect(() => {
    setDisplay(toInputFormat(value));
  }, [value]);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target) && !document.getElementById('datepicker-portal')?.contains(e.target)) {
        setOpen(false);
        setShowYearPicker(false);
        setShowMonthPicker(false);
        setFocused(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const monthDays = useMemo(() => {
    const total = daysInMonth(viewYear, viewMonth);
    const first = firstDayOfMonth(viewYear, viewMonth);
    const days = [];
    for (let i = 0; i < first; i++) days.push(null);
    for (let d = 1; d <= total; d++) days.push(d);
    return days;
  }, [viewYear, viewMonth]);

  const handleInput = (raw) => {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    const formatted = formatDisplay(digits);
    setDisplay(formatted);

    if (digits.length === 8) {
      const iso = toIsoFormat(digits);
      if (isValidDate(iso)) {
        onChange(iso);
      }
    }
  };

  const handleBlur = () => {
    if (display.length === 10) {
      const iso = toIsoFormat(display);
      if (isValidDate(iso)) {
        onChange(iso);
        setDisplay(toInputFormat(iso));
        return;
      }
    }
    setDisplay(toInputFormat(value));
    setFocused(false);
  };

  const toggleOpen = () => {
    if (open) {
      setOpen(false);
      setShowYearPicker(false);
      setShowMonthPicker(false);
      return;
    }
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const calendarHeight = 340;
      const spaceBelow = window.innerHeight - rect.bottom;
      const above = spaceBelow < calendarHeight && rect.top > calendarHeight;
      setPlaceAbove(above);
      setCalendarPos({
        top: above ? rect.top - 8 : rect.bottom + 6,
        left: rect.left,
      });
    }
    if (value && isValidDate(value)) {
      const d = new Date(value + 'T00:00:00');
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
    setOpen(true);
    setShowYearPicker(false);
    setShowMonthPicker(false);
    setFocused(true);
  };

  const selectDay = (day) => {
    if (!day) return;
    const mm = String(viewMonth + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    const iso = `${viewYear}-${mm}-${dd}`;
    if (!isValidDate(iso)) return;

    const d = new Date(iso + 'T00:00:00');
    if (min && d < new Date(min + 'T00:00:00')) return;
    if (max && d > new Date(max + 'T00:00:00')) return;

    onChange(iso);
    setDisplay(toInputFormat(iso));
    setOpen(false);
    setShowYearPicker(false);
    setShowMonthPicker(false);
  };

  const selectMonth = (month) => {
    setViewMonth(month);
    setShowMonthPicker(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(viewYear - 1); }
    else setViewMonth(viewMonth - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(viewYear + 1); }
    else setViewMonth(viewMonth + 1);
  };

  const selectYear = (year) => {
    setViewYear(year);
    setShowYearPicker(false);
    setYearPage(0);
  };

  const generateYearRange = () => {
    const startYear = currentYear - (yearPage * 12);
    const years = [];
    for (let y = startYear; y > startYear - 12 && y >= minYear; y--) {
      years.push(y);
    }
    return years;
  };

  return (
    <div ref={ref} className="relative">
      <div className={`flex items-center ${className} ${focused || open ? '!border-medi-400 ring-2 ring-medi-200' : ''}`}>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          required={required}
          placeholder={placeholder}
          value={display}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          onChange={(e) => handleInput(e.target.value)}
          className="flex-1 min-w-0 bg-transparent border-none outline-none text-inherit font-inherit placeholder:text-gray-400"
        />
        <button
          type="button"
          onClick={toggleOpen}
          className="shrink-0 p-1 rounded-lg hover:bg-black/5 transition-colors text-gray-400 hover:text-medi-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
          </svg>
        </button>
      </div>

      {open && createPortal(
        <div
          style={{ top: calendarPos.top, left: calendarPos.left }}
          className="fixed z-[9999] bg-white border border-gray-200 rounded-xl shadow-xl p-3 w-64 animate-[fadeIn_0.15s_ease-out]"
          id="datepicker-portal"
        >
          {showMonthPicker ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <button onClick={() => setShowMonthPicker(false)} className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{viewYear}</span>
                <div className="w-6" />
              </div>
              <div className="grid grid-cols-3 gap-1">
                {MONTHS.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => selectMonth(i)}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      i === viewMonth
                        ? 'bg-medi-500 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {m.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          ) : showYearPicker ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-1">
                <button onClick={() => setYearPage(Math.max(0, yearPage - 1))} disabled={yearPage === 0} className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 disabled:opacity-30">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Seleccionar año</span>
                <button
                  onClick={() => setYearPage(yearPage + 1)}
                  disabled={currentYear - ((yearPage + 1) * 12) < minYear}
                  className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 disabled:opacity-30"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-1">
                {generateYearRange().map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => selectYear(y)}
                    className={`py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      y === viewYear
                        ? 'bg-medi-500 text-white'
                        : y === currentYear
                          ? 'bg-medi-50 text-medi-700'
                          : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <button onClick={prevMonth} className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowMonthPicker(true)}
                    className="text-sm font-bold text-gray-900 hover:text-medi-600 transition-colors px-1"
                  >
                    {MONTHS[viewMonth]}
                  </button>
                  <button
                    onClick={() => { setShowYearPicker(true); setYearPage(0); }}
                    className="text-sm font-bold text-medi-500 hover:text-medi-700 transition-colors px-1"
                  >
                    {viewYear}
                  </button>
                </div>
                <button onClick={nextMonth} className="p-1 rounded-lg hover:bg-gray-100 transition-colors text-gray-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                </button>
              </div>
              <div className="grid grid-cols-7 gap-0.5">
                {DAYS.map((d) => (
                  <div key={d} className="text-center text-[10px] font-bold text-gray-400 uppercase py-1">{d}</div>
                ))}
                {monthDays.map((day, i) => {
                  if (!day) return <div key={`e${i}`} className="h-8" />;
                  const mm = String(viewMonth + 1).padStart(2, '0');
                  const dd = String(day).padStart(2, '0');
                  const iso = `${viewYear}-${mm}-${dd}`;
                  const isSelected = iso === value;
                  const todayIso = today.toISOString().split('T')[0];
                  const isToday = iso === todayIso;
                  const d = new Date(iso + 'T00:00:00');
                  const isDisabled = (min && d < new Date(min + 'T00:00:00')) || (max && d > new Date(max + 'T00:00:00'));
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => selectDay(day)}
                      className={`h-8 rounded-lg text-xs font-semibold transition-colors ${
                        isSelected
                          ? 'bg-medi-500 text-white'
                          : isToday
                            ? 'bg-medi-50 text-medi-700 ring-1 ring-medi-300'
                            : isDisabled
                              ? 'text-gray-300 cursor-not-allowed'
                              : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

export default DateInput;

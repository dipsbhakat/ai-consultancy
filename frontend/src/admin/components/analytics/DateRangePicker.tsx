import { useState, useRef, useEffect } from 'react';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  className?: string;
}

const predefinedRanges = [
  {
    label: 'Today',
    getValue: () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const endOfDay = new Date(today);
      endOfDay.setHours(23, 59, 59, 999);
      return { startDate: today, endDate: endOfDay };
    }
  },
  {
    label: 'Yesterday',
    getValue: () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      const endOfDay = new Date(yesterday);
      endOfDay.setHours(23, 59, 59, 999);
      return { startDate: yesterday, endDate: endOfDay };
    }
  },
  {
    label: 'Last 7 days',
    getValue: () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = new Date();
      start.setDate(start.getDate() - 6);
      start.setHours(0, 0, 0, 0);
      return { startDate: start, endDate: end };
    }
  },
  {
    label: 'Last 30 days',
    getValue: () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = new Date();
      start.setDate(start.getDate() - 29);
      start.setHours(0, 0, 0, 0);
      return { startDate: start, endDate: end };
    }
  },
  {
    label: 'Last 90 days',
    getValue: () => {
      const end = new Date();
      end.setHours(23, 59, 59, 999);
      const start = new Date();
      start.setDate(start.getDate() - 89);
      start.setHours(0, 0, 0, 0);
      return { startDate: start, endDate: end };
    }
  },
  {
    label: 'This month',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      end.setHours(23, 59, 59, 999);
      return { startDate: start, endDate: end };
    }
  },
  {
    label: 'Last month',
    getValue: () => {
      const now = new Date();
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      start.setHours(0, 0, 0, 0);
      const end = new Date(now.getFullYear(), now.getMonth(), 0);
      end.setHours(23, 59, 59, 999);
      return { startDate: start, endDate: end };
    }
  }
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({ 
  value, 
  onChange, 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempRange, setTempRange] = useState<DateRange>(value);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateForInput = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const parseInputDate = (dateString: string): Date => {
    const date = new Date(dateString);
    return date;
  };

  const getSelectedRangeLabel = (): string => {
    const range = predefinedRanges.find(range => {
      const { startDate, endDate } = range.getValue();
      return (
        Math.abs(value.startDate.getTime() - startDate.getTime()) < 1000 * 60 * 60 && // Within 1 hour
        Math.abs(value.endDate.getTime() - endDate.getTime()) < 1000 * 60 * 60
      );
    });

    if (range) {
      return range.label;
    }

    // Custom range
    if (value.startDate.toDateString() === value.endDate.toDateString()) {
      return formatDate(value.startDate);
    }

    return `${formatDate(value.startDate)} - ${formatDate(value.endDate)}`;
  };

  const handlePredefinedRangeSelect = (range: DateRange) => {
    onChange(range);
    setTempRange(range);
    setIsOpen(false);
  };

  const handleCustomRangeApply = () => {
    // Ensure start date is not after end date
    if (tempRange.startDate > tempRange.endDate) {
      const correctedRange = {
        startDate: tempRange.endDate,
        endDate: tempRange.startDate
      };
      setTempRange(correctedRange);
      onChange(correctedRange);
    } else {
      onChange(tempRange);
    }
    setIsOpen(false);
  };

  const handleStartDateChange = (dateString: string) => {
    const newStartDate = parseInputDate(dateString);
    newStartDate.setHours(0, 0, 0, 0);
    setTempRange(prev => ({
      ...prev,
      startDate: newStartDate
    }));
  };

  const handleEndDateChange = (dateString: string) => {
    const newEndDate = parseInputDate(dateString);
    newEndDate.setHours(23, 59, 59, 999);
    setTempRange(prev => ({
      ...prev,
      endDate: newEndDate
    }));
  };

  const getDaysBetween = (start: Date, end: Date): number => {
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex items-center space-x-2">
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{getSelectedRangeLabel()}</span>
        </div>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg">
          <div className="p-4">
            {/* Predefined Ranges */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Quick Select</h4>
              <div className="grid grid-cols-2 gap-2">
                {predefinedRanges.map((range) => (
                  <button
                    key={range.label}
                    onClick={() => handlePredefinedRangeSelect(range.getValue())}
                    className="px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Range */}
            <div className="border-t border-gray-200 pt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Custom Range</h4>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formatDateForInput(tempRange.startDate)}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formatDateForInput(tempRange.endDate)}
                    onChange={(e) => handleEndDateChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* Range Info */}
                <div className="text-xs text-gray-500">
                  {getDaysBetween(tempRange.startDate, tempRange.endDate)} day(s) selected
                </div>

                {/* Apply Button */}
                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCustomRangeApply}
                    className="px-4 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

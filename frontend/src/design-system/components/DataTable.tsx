import { useState, useMemo, ReactNode, HTMLAttributes } from 'react';
import { Button } from './Button';
import { Badge } from './Badge';

/* ===== TYPES ===== */
export interface Column<T = any> {
  key: keyof T | string;
  header: ReactNode;
  width?: string | number;
  minWidth?: string | number;
  sortable?: boolean;
  filterable?: boolean;
  sticky?: 'left' | 'right';
  render?: (value: any, row: T, index: number) => ReactNode;
  getValue?: (row: T) => any;
}

export interface TableData {
  id: string | number;
  [key: string]: any;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface DataTableProps<T extends TableData> extends Omit<HTMLAttributes<HTMLDivElement>, 'data'> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  emptyState?: ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  selectable?: boolean | 'single' | 'multiple';
  selectedRows?: (string | number)[];
  onSelectionChange?: (selected: (string | number)[]) => void;
  onRowClick?: (row: T, index: number) => void;
  pageSize?: number;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  showPagination?: boolean;
  stickyHeader?: boolean;
  virtualized?: boolean;
  className?: string;
  variant?: 'default' | 'compact' | 'comfortable';
  actions?: ReactNode;
}

/* ===== MAIN COMPONENT ===== */
export const DataTable = <T extends TableData>({
  data,
  columns,
  loading = false,
  emptyState,
  sortable = true,
  filterable = false,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  onRowClick,
  pageSize = 10,
  currentPage = 1,
  totalPages,
  onPageChange,
  showPagination = true,
  stickyHeader = true,
  virtualized = false,
  className = '',
  variant = 'default',
  actions,
  ...props
}: DataTableProps<T>) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Calculate total pages if not provided
  const calculatedTotalPages = totalPages || Math.ceil(data.length / pageSize);

  // Apply sorting and filtering
  const processedData = useMemo(() => {
    let result = [...data];

    // Apply filters
    if (filterable && Object.keys(filters).length > 0) {
      result = result.filter(row => {
        return Object.entries(filters).every(([key, value]) => {
          if (!value) return true;
          const cellValue = getCellValue(row, key, columns);
          return String(cellValue).toLowerCase().includes(value.toLowerCase());
        });
      });
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = getCellValue(a, sortConfig.key, columns);
        const bValue = getCellValue(b, sortConfig.key, columns);

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    // Apply pagination
    if (showPagination && !totalPages) {
      const startIndex = (currentPage - 1) * pageSize;
      result = result.slice(startIndex, startIndex + pageSize);
    }

    return result;
  }, [data, sortConfig, filters, currentPage, pageSize, columns, filterable, showPagination, totalPages]);

  // Handle sorting
  const handleSort = (key: string) => {
    if (!sortable) return;

    setSortConfig(prevConfig => {
      if (prevConfig?.key === key) {
        return prevConfig.direction === 'asc'
          ? { key, direction: 'desc' }
          : null;
      }
      return { key, direction: 'asc' };
    });
  };

  // Handle selection
  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;

    if (checked) {
      const allIds = data.map(row => row.id);
      onSelectionChange(allIds);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    if (!onSelectionChange) return;

    if (selectable === 'single') {
      onSelectionChange(checked ? [id] : []);
    } else {
      const newSelected = checked
        ? [...selectedRows, id]
        : selectedRows.filter(rowId => rowId !== id);
      onSelectionChange(newSelected);
    }
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    if (onPageChange && page >= 1 && page <= calculatedTotalPages) {
      onPageChange(page);
    }
  };

  // Calculate row density styles
  const getRowStyles = () => {
    switch (variant) {
      case 'compact':
        return 'py-2';
      case 'comfortable':
        return 'py-4';
      default:
        return 'py-3';
    }
  };

  const isAllSelected = data.length > 0 && selectedRows.length === data.length;
  const isIndeterminate = selectedRows.length > 0 && selectedRows.length < data.length;

  return (
    <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden ${className}`} {...props}>
      {/* Header with actions */}
      {actions && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectable && selectedRows.length > 0 && (
                <Badge variant="primary">
                  {selectedRows.length} selected
                </Badge>
              )}
            </div>
            <div>{actions}</div>
          </div>
        </div>
      )}

      {/* Table container */}
      <div className="overflow-auto max-h-[600px]">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          {/* Table header */}
          <thead className={`bg-gray-50 dark:bg-gray-800 ${stickyHeader ? 'sticky top-0 z-10' : ''}`}>
            <tr>
              {/* Selection column */}
              {selectable && (
                <th className="w-12 px-6 py-3 text-left">
                  {selectable === 'multiple' && (
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={input => {
                        if (input) input.indeterminate = isIndeterminate;
                      }}
                      onChange={e => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                    />
                  )}
                </th>
              )}

              {/* Data columns */}
              {columns.map((column, index) => (
                <th
                  key={String(column.key) + index}
                  className={`
                    px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider
                    ${column.sortable !== false && sortable ? 'cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 select-none' : ''}
                    ${column.sticky === 'left' ? 'sticky left-0 z-20 bg-gray-50 dark:bg-gray-800' : ''}
                    ${column.sticky === 'right' ? 'sticky right-0 z-20 bg-gray-50 dark:bg-gray-800' : ''}
                  `}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth,
                  }}
                  onClick={() => column.sortable !== false && handleSort(String(column.key))}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.sortable !== false && sortable && sortConfig?.key === column.key && (
                      <span className="text-blue-600 dark:text-blue-400">
                        {sortConfig.direction === 'asc' ? (
                          <ChevronUpIcon className="w-4 h-4" />
                        ) : (
                          <ChevronDownIcon className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>

                  {/* Filter input */}
                  {filterable && column.filterable !== false && (
                    <div className="mt-2" onClick={e => e.stopPropagation()}>
                      <input
                        type="text"
                        placeholder={`Filter ${column.header}...`}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={filters[String(column.key)] || ''}
                        onChange={e => setFilters(prev => ({ ...prev, [String(column.key)]: e.target.value }))}
                      />
                    </div>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table body */}
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Loading...</span>
                  </div>
                </td>
              </tr>
            ) : processedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center">
                  {emptyState || (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <InboxIcon className="w-6 h-6 text-gray-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">No data</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">No records found matching your criteria.</p>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ) : (
              processedData.map((row, index) => {
                const isSelected = selectedRows.includes(row.id);
                
                return (
                  <tr
                    key={row.id}
                    className={`
                      hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                      ${isSelected ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                      ${onRowClick ? 'cursor-pointer' : ''}
                    `}
                    onClick={() => onRowClick?.(row, index)}
                  >
                    {/* Selection column */}
                    {selectable && (
                      <td className="w-12 px-6 py-3" onClick={e => e.stopPropagation()}>
                        <input
                          type={selectable === 'single' ? 'radio' : 'checkbox'}
                          checked={isSelected}
                          onChange={e => handleSelectRow(row.id, e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600"
                        />
                      </td>
                    )}

                    {/* Data columns */}
                    {columns.map((column, columnIndex) => {
                      const cellValue = getCellValue(row, String(column.key), columns);
                      const renderedValue = column.render 
                        ? column.render(cellValue, row, index)
                        : cellValue;

                      return (
                        <td
                          key={String(column.key) + columnIndex}
                          className={`
                            px-6 ${getRowStyles()} text-sm text-gray-900 dark:text-gray-100 whitespace-nowrap
                            ${column.sticky === 'left' ? 'sticky left-0 z-10 bg-white dark:bg-gray-900' : ''}
                            ${column.sticky === 'right' ? 'sticky right-0 z-10 bg-white dark:bg-gray-900' : ''}
                          `}
                          style={{
                            width: column.width,
                            minWidth: column.minWidth,
                          }}
                        >
                          {renderedValue}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && calculatedTotalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing page {currentPage} of {calculatedTotalPages}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage <= 1}
                onClick={() => handlePageChange(currentPage - 1)}
              >
                Previous
              </Button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(5, calculatedTotalPages) }, (_, i) => {
                const page = Math.max(1, Math.min(calculatedTotalPages - 4, currentPage - 2)) + i;
                if (page > calculatedTotalPages) return null;
                
                return (
                  <Button
                    key={page}
                    variant={page === currentPage ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </Button>
                );
              })}
              
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage >= calculatedTotalPages}
                onClick={() => handlePageChange(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ===== UTILITY FUNCTIONS ===== */
const getCellValue = <T extends TableData>(row: T, key: string, columns: Column<T>[]) => {
  const column = columns.find(col => String(col.key) === key);
  
  if (column?.getValue) {
    return column.getValue(row);
  }
  
  return row[key];
};

/* ===== ICON COMPONENTS ===== */
const ChevronUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
  </svg>
);

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const InboxIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 3v2.25M15 3v2.25M3 9.75h4.5m13.5 0H16.5M3 9.75v8.25a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V9.75M3 9.75a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 9.75" />
  </svg>
);

/* ===== ADDITIONAL UTILITY COMPONENTS ===== */
export const TableActions = ({ children }: { children: ReactNode }) => (
  <div className="flex items-center space-x-2">
    {children}
  </div>
);

export const TableSearch = ({ 
  value, 
  onChange, 
  placeholder = "Search..." 
}: { 
  value: string; 
  onChange: (value: string) => void; 
  placeholder?: string;
}) => (
  <div className="relative">
    <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
  </svg>
);

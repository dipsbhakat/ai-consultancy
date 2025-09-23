import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, Text, Button, Input, Badge, Skeleton } from './components';

/* ===== DATA EXPLORER TYPES ===== */

export interface ColumnDefinition<T = any> {
  key: keyof T;
  title: string;
  width?: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  type?: 'string' | 'number' | 'date' | 'boolean' | 'enum';
  align?: 'left' | 'center' | 'right';
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'number';
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}

export interface DataExplorerProps<T = any> {
  data: T[];
  columns: ColumnDefinition<T>[];
  loading?: boolean;
  error?: string;
  filters?: FilterConfig[];
  sorting?: SortConfig;
  onSortChange?: (sort: SortConfig | null) => void;
  pagination?: PaginationConfig;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  selection?: {
    enabled: boolean;
    selected: string[];
    onSelectionChange: (selected: string[]) => void;
    getRowId: (row: T) => string;
  };
  density?: 'compact' | 'normal' | 'comfortable';
  searchable?: boolean;
  exportable?: boolean;
  onExport?: () => void;
  emptyState?: {
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
}

/* ===== DATA EXPLORER COMPONENT ===== */

export const DataExplorer = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  error,
  filters = [],
  sorting,
  onSortChange,
  pagination,
  onPageChange,
  onPageSizeChange,
  selection,
  density = 'normal',
  searchable = true,
  exportable = false,
  onExport,
  emptyState
}: DataExplorerProps<T>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [localSorting, setLocalSorting] = useState<SortConfig | null>(sorting || null);

  // Filter and search data
  const filteredData = useMemo(() => {
    let result = [...data];

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(row => {
        return columns.some(col => {
          const value = row[col.key];
          return String(value || '').toLowerCase().includes(query);
        });
      });
    }

    // Apply filters
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        result = result.filter(row => {
          const rowValue = row[key];
          if (typeof value === 'string') {
            return String(rowValue || '').toLowerCase().includes(value.toLowerCase());
          }
          return rowValue === value;
        });
      }
    });

    // Apply sorting
    if (localSorting) {
      result.sort((a, b) => {
        const aVal = a[localSorting.key];
        const bVal = b[localSorting.key];
        
        if (aVal === bVal) return 0;
        
        let comparison = 0;
        if (aVal > bVal) comparison = 1;
        if (aVal < bVal) comparison = -1;
        
        return localSorting.direction === 'desc' ? -comparison : comparison;
      });
    }

    return result;
  }, [data, searchQuery, activeFilters, localSorting, columns]);

  // Handle sorting
  const handleSort = (columnKey: string) => {
    const newSort: SortConfig = {
      key: columnKey,
      direction: localSorting?.key === columnKey && localSorting.direction === 'asc' ? 'desc' : 'asc'
    };
    
    setLocalSorting(newSort);
    onSortChange?.(newSort);
  };

  // Handle filter change
  const handleFilterChange = (key: string, value: any) => {
    setActiveFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Clear all filters
  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  // Get active filter count
  const activeFilterCount = Object.values(activeFilters).filter(v => v !== '' && v !== null).length + (searchQuery ? 1 : 0);

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8">
            <Text variant="heading-md" color="red" className="mb-2">
              Error Loading Data
            </Text>
            <Text variant="body-md" color="secondary">
              {error}
            </Text>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="data-explorer">
      {/* Header */}
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <Text variant="heading-md" color="primary">
              Data Explorer
            </Text>
            <Text variant="body-sm" color="secondary">
              {filteredData.length} of {data.length} items
            </Text>
          </div>
          
          <div className="flex items-center gap-3">
            {exportable && (
              <Button variant="ghost" size="sm" onClick={onExport}>
                <ExportIcon />
                Export
              </Button>
            )}
            
            <DensityToggle density={density} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-4 mb-4">
            {searchable && (
              <div className="flex-1 max-w-sm">
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<SearchIcon />}
                />
              </div>
            )}
            
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="blue" size="sm">
                  {activeFilterCount} filters
                </Badge>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear
                </Button>
              </div>
            )}
          </div>

          {filters.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {filters.map(filter => (
                <FilterInput
                  key={filter.key}
                  filter={filter}
                  value={activeFilters[filter.key] || ''}
                  onChange={(value) => handleFilterChange(filter.key, value)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <DataTableSkeleton columns={columns} density={density} />
          ) : filteredData.length === 0 ? (
            <EmptyState
              title={emptyState?.title || "No data found"}
              description={emptyState?.description || "Try adjusting your filters or search query"}
              action={emptyState?.action}
            />
          ) : (
            <DataTable
              data={filteredData}
              columns={columns}
              sorting={localSorting}
              onSort={handleSort}
              selection={selection}
              density={density}
            />
          )}
        </div>

        {/* Pagination */}
        {pagination && (
          <div className="p-6 border-t border-gray-200">
            <Pagination
              config={pagination}
              onPageChange={onPageChange}
              onPageSizeChange={onPageSizeChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/* ===== DATA TABLE COMPONENT ===== */

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  sorting?: SortConfig | null;
  onSort: (key: string) => void;
  selection?: DataExplorerProps<T>['selection'];
  density: 'compact' | 'normal' | 'comfortable';
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  sorting,
  onSort,
  selection,
  density
}: DataTableProps<T>) => {
  const densityClasses = {
    compact: 'table-compact',
    normal: 'table-normal',
    comfortable: 'table-comfortable'
  };

  const handleSelectAll = () => {
    if (!selection) return;
    
    const allIds = data.map(selection.getRowId);
    const isAllSelected = allIds.every(id => selection.selected.includes(id));
    
    selection.onSelectionChange(isAllSelected ? [] : allIds);
  };

  const isIndeterminate = selection && selection.selected.length > 0 && !data.every(row => selection.selected.includes(selection.getRowId(row)));

  const selectAllRef = React.useRef<HTMLInputElement>(null);
  
  React.useEffect(() => {
    if (selectAllRef.current && selection) {
      selectAllRef.current.indeterminate = Boolean(isIndeterminate);
    }
  }, [isIndeterminate, selection]);

  const handleSelectRow = (row: T) => {
    if (!selection) return;
    
    const id = selection.getRowId(row);
    const isSelected = selection.selected.includes(id);
    
    if (isSelected) {
      selection.onSelectionChange(selection.selected.filter(s => s !== id));
    } else {
      selection.onSelectionChange([...selection.selected, id]);
    }
  };

  return (
    <table className={`data-table ${densityClasses[density]}`}>
      <thead>
        <tr>
          {selection?.enabled && (
            <th className="table-cell-checkbox">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={data.length > 0 && data.every(row => selection.selected.includes(selection.getRowId(row)))}
                onChange={handleSelectAll}
              />
            </th>
          )}
          
          {columns.map(column => (
            <th
              key={String(column.key)}
              className={`table-header ${column.sortable ? 'table-header-sortable' : ''}`}
              style={{ width: column.width, textAlign: column.align || 'left' }}
              onClick={column.sortable ? () => onSort(String(column.key)) : undefined}
            >
              <div className="table-header-content">
                <Text variant="label-sm" weight="medium">
                  {column.title}
                </Text>
                {column.sortable && (
                  <SortIcon
                    direction={sorting?.key === column.key ? sorting.direction : null}
                  />
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      
      <tbody>
        {data.map((row, index) => (
          <tr key={index} className="table-row">
            {selection?.enabled && (
              <td className="table-cell-checkbox">
                <input
                  type="checkbox"
                  checked={selection.selected.includes(selection.getRowId(row))}
                  onChange={() => handleSelectRow(row)}
                />
              </td>
            )}
            
            {columns.map(column => (
              <td
                key={String(column.key)}
                className="table-cell"
                style={{ textAlign: column.align || 'left' }}
              >
                {column.render ? (
                  column.render(row[column.key], row)
                ) : (
                  <Text variant="body-sm" color="primary">
                    {String(row[column.key] || '')}
                  </Text>
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/* ===== HELPER COMPONENTS ===== */

const FilterInput: React.FC<{
  filter: FilterConfig;
  value: any;
  onChange: (value: any) => void;
}> = ({ filter, value, onChange }) => {
  if (filter.type === 'select' && filter.options) {
    return (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="input"
        style={{ width: '150px' }}
      >
        <option value="">{filter.placeholder || `All ${filter.label}`}</option>
        {filter.options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <Input
      placeholder={filter.placeholder || filter.label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type={filter.type === 'number' ? 'number' : filter.type === 'date' ? 'date' : 'text'}
      className="w-40"
    />
  );
};

const DensityToggle: React.FC<{ density: string }> = () => {
  return (
    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-md">
      <button className="p-1 rounded text-xs">⚏</button>
      <button className="p-1 rounded text-xs">⚏⚏</button>
      <button className="p-1 rounded text-xs">⚏⚏⚏</button>
    </div>
  );
};

const SortIcon: React.FC<{ direction: 'asc' | 'desc' | null }> = ({ direction }) => {
  return (
    <div className="sort-icon">
      {direction === 'asc' && <ChevronUpIcon />}
      {direction === 'desc' && <ChevronDownIcon />}
      {!direction && <SortDefaultIcon />}
    </div>
  );
};

const DataTableSkeleton: React.FC<{
  columns: ColumnDefinition[];
  density: string;
}> = ({ columns, density }) => {
  const rowHeight = density === 'compact' ? '40px' : density === 'comfortable' ? '64px' : '52px';
  
  return (
    <div className="p-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex gap-4 mb-3" style={{ height: rowHeight }}>
          {columns.map((col, j) => (
            <Skeleton key={j} variant="rectangular" width={col.width || '120px'} height="20px" />
          ))}
        </div>
      ))}
    </div>
  );
};

const EmptyState: React.FC<{
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}> = ({ title, description, action }) => {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 mx-auto mb-4 text-gray-300">
        <EmptyIcon />
      </div>
      <Text variant="heading-md" color="primary" className="mb-2">
        {title}
      </Text>
      <Text variant="body-md" color="secondary" className="mb-6">
        {description}
      </Text>
      {action && (
        <Button onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
};

const Pagination: React.FC<{
  config: PaginationConfig;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}> = ({ config, onPageChange }) => {
  const totalPages = Math.ceil(config.total / config.pageSize);
  
  return (
    <div className="flex items-center justify-between">
      <Text variant="body-sm" color="secondary">
        Showing {(config.page - 1) * config.pageSize + 1} to{' '}
        {Math.min(config.page * config.pageSize, config.total)} of {config.total} results
      </Text>
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          disabled={config.page <= 1}
          onClick={() => onPageChange?.(config.page - 1)}
        >
          Previous
        </Button>
        
        <Text variant="body-sm" color="secondary">
          Page {config.page} of {totalPages}
        </Text>
        
        <Button
          variant="ghost"
          size="sm"
          disabled={config.page >= totalPages}
          onClick={() => onPageChange?.(config.page + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

/* ===== ICONS ===== */

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

const ExportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const ChevronUpIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const SortDefaultIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <polyline points="18 8 12 2 6 8"/>
    <polyline points="6 16 12 22 18 16"/>
  </svg>
);

const EmptyIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <line x1="9" y1="9" x2="15" y2="15"/>
    <line x1="15" y1="9" x2="9" y2="15"/>
  </svg>
);

export default DataExplorer;

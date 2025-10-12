import React, { useState, useEffect, useCallback } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import DateRangePicker from './DateRangePicker';
import type { 
  Filter,
  Sort,
  LocalizedField,
  ResponseQueryOptions,
  DateFilter,
  StringFilter
} from '../api';
import { OrderMode } from '../api';

// Абстрактные типы для работы с данными
export interface DataItem {
  id: string;
  [key: string]: any;
}

export interface DataListProps<T extends DataItem> {
  onDataLoad?: (data: T[]) => void;
  className?: string;
  pageSize?: number;
  // Абстрактные методы для работы с API
  loadData: (page: number, pageSize: number, filters?: Filter, sorts?: Sort[]) => Promise<{
    data: T[];
    options: ResponseQueryOptions;
  }>;
  // Методы для рендеринга
  renderItem: (item: T, index: number, getLocalizedValue: (field: string, value: string) => string) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  renderSkeleton?: () => React.ReactNode;
  // Опциональные настройки
  showFilters?: boolean;
  showPagination?: boolean;
  autoLoad?: boolean;
}

export function AbstractDataList<T extends DataItem>({
  onDataLoad,
  className = '',
  pageSize = 5, // Изменено с 10 на 5
  loadData,
  renderItem,
  renderEmpty,
  renderSkeleton,
  showFilters = true,
  showPagination = true,
  autoLoad = true
}: DataListProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [availableFilters, setAvailableFilters] = useState<LocalizedField[]>([]);
  const [availableSorts, setAvailableSorts] = useState<string[]>([]);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [filters, setFilters] = useState<Filter>({});
  const [sorts, setSorts] = useState<Sort[]>([]);
  const { t } = useLocalization();

  // Состояния для фильтров
  const [dateFilters, setDateFilters] = useState<{from: string, to: string}>({from: '', to: ''});
  const [stringFilters, setStringFilters] = useState<{[field: string]: string[]}>({});

  // Функция для получения локализованного значения enum поля
  const getLocalizedValue = (field: string, value: string): string => {
    const filter = availableFilters.find(f => f.field === field);
    if (!filter) return value;
    
    const item = filter.items.find(i => i.item === value);
    return item ? item.localization : value;
  };

  const loadDataCallback = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      // Отправляем на backend страницу с 0, но отображаем с 1
      const backendPage = page - 1;
      const result = await loadData(backendPage, pageSize, filters, sorts);
      
      setData(result.data);
      setTotalPages(result.options.totalPageCount || 1);
      setAvailableFilters(result.options.filters || []);
      setAvailableSorts(result.options.sorts || []);
      
      if (onDataLoad) {
        onDataLoad(result.data);
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError(t('common.error.loadingData'));
    } finally {
      setLoading(false);
    }
  }, [loadData, pageSize, filters, sorts, onDataLoad, t]);

  useEffect(() => {
    if (autoLoad) {
      loadDataCallback(currentPage);
    }
  }, [currentPage, loadDataCallback, autoLoad]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDateRangeChange = (from: string, to: string) => {
    setDateFilters({ from, to });
    
    // Отправляем запрос только если обе даты заполнены
    if (from && to) {
      // Преобразуем даты в формат YYYY-MM-DD без времени
      const dateFilter: DateFilter = {
        field: 'createdAt', // Хардкод как указано в требованиях
        from: from, // Отправляем дату как есть в формате YYYY-MM-DD
        to: to      // Отправляем дату как есть в формате YYYY-MM-DD
      };
      
      setFilters(prevFilters => ({
        ...prevFilters,
        dateFilters: [dateFilter]
      }));
      setCurrentPage(1);
    } else {
      // Очищаем фильтр дат если не выбраны обе даты
      setFilters(prevFilters => ({
        ...prevFilters,
        dateFilters: []
      }));
    }
  };

  const handleStringFilterChange = (field: string, values: string[]) => {
    setStringFilters(prev => {
      const newFilters = {...prev, [field]: values};
      
      // Обновляем фильтры
      const stringFiltersArray: StringFilter[] = Object.entries(newFilters)
        .filter(([_, values]) => values.length > 0)
        .map(([field, values]) => ({ field, values }));
      
      setFilters(prevFilters => ({
        ...prevFilters,
        stringFilters: stringFiltersArray
      }));
      setCurrentPage(1);
      
      return newFilters;
    });
  };

  const handleSortChange = (field: string, mode: OrderMode) => {
    setSorts(prev => {
      const newSorts = prev.filter(s => s.field !== field);
      if (mode) {
        newSorts.push({ field, mode });
      }
      return newSorts;
    });
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setSorts([]);
    setDateFilters({from: '', to: ''});
    setStringFilters({});
    setCurrentPage(1);
  };

  const refresh = () => {
    loadDataCallback(currentPage);
  };

  if (loading && data.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {renderSkeleton ? renderSkeleton() : (
          <div className="text-center py-8">
            <div className="text-gray-500">{t('common.loading')}</div>
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Filters Toggle Button */}
      {showFilters && (
        <div className="mb-4">
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className="inline-flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <span className="mr-2">🔍</span>
            {showFiltersPanel ? t('common.hideFilters') : t('common.showFilters')}
          </button>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && showFiltersPanel && (
        <div className="bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200">
          <div className="space-y-4">
            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('common.dateRange')}
              </label>
              <DateRangePicker
                from={dateFilters.from}
                to={dateFilters.to}
                onChange={handleDateRangeChange}
                className="w-full"
              />
            </div>

            {/* String Filters */}
            {availableFilters.map((filter) => (
              <div key={filter.field}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {filter.field}
                </label>
                <div className="flex flex-wrap gap-2">
                  {filter.items.map((item) => (
                    <label key={item.item} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={stringFilters[filter.field]?.includes(item.item) || false}
                        onChange={(e) => {
                          const currentValues = stringFilters[filter.field] || [];
                          const newValues = e.target.checked
                            ? [...currentValues, item.item]
                            : currentValues.filter(v => v !== item.item);
                          handleStringFilterChange(filter.field, newValues);
                        }}
                        className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{item.localization}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}

            {/* Sort Options */}
            {availableSorts.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('common.sortBy')}
                </label>
                <div className="space-y-2">
                  {availableSorts.map((sort) => (
                    <div key={sort} className="flex items-center space-x-3">
                      <span className="text-sm text-gray-600 min-w-[80px]">
                        {sort}:
                      </span>
                      <select
                        value={sorts.find(s => s.field === sort)?.mode || ''}
                        onChange={(e) => handleSortChange(sort, e.target.value as OrderMode)}
                        className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        <option value="">{t('common.noSort')}</option>
                        <option value="ASC">↑ {t('common.ascending')}</option>
                        <option value="DESC">↓ {t('common.descending')}</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters Button */}
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                {t('common.clearFilters')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Display */}
      <div>
        {loading ? (
          renderSkeleton ? renderSkeleton() : (
            <div className="space-y-3">
              {[...Array(pageSize)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          )
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : data.length === 0 ? (
          renderEmpty ? renderEmpty() : (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-gray-500">{t('common.noData')}</div>
            </div>
          )
        ) : (
          <div className="space-y-3">
            {data.map((item, index) => renderItem(item, index, getLocalizedValue))}
          </div>
        )}

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                ←
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg transition-colors text-sm ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AbstractDataList;
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
      // Преобразуем даты в ISO формат с временем
      const fromDate = new Date(from + 'T00:00:00.000000');
      const toDate = new Date(to + 'T23:59:59.999999');
      
      const dateFilter: DateFilter = {
        field: 'createdAt', // Хардкод как указано в требованиях
        from: fromDate.toISOString(),
        to: toDate.toISOString()
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
    <div className={`relative ${className}`}>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10 rounded-3xl blur-3xl -z-10 transform scale-105"></div>

      {/* Main container */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-xl translate-y-4 -translate-x-4"></div>

        <div className="relative z-10">
          {/* Header with filters toggle */}
          {showFilters && (
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">{t('common.filters')}</h3>
              <button
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <span className="mr-2">🔍</span>
                {showFiltersPanel ? t('common.hideFilters') : t('common.showFilters')}
              </button>
            </div>
          )}

          {/* Filters Panel */}
          {showFilters && showFiltersPanel && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-white/30 mb-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Date Range Filter */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="text-xl mr-2">📅</span>
                    {t('common.dateRange')}
                  </h4>
                  <DateRangePicker
                    from={dateFilters.from}
                    to={dateFilters.to}
                    onChange={handleDateRangeChange}
                    className="w-full"
                  />
                </div>

                {/* String Filters */}
                {availableFilters.map((filter) => (
                  <div key={filter.field} className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                      <span className="text-xl mr-2">🏷️</span>
                      {filter.field}
                    </h4>
                    <div className="space-y-2">
                      {filter.items.map((item) => (
                        <label key={item.item} className="flex items-center space-x-3 p-3 bg-white/40 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/60 transition-all duration-200 cursor-pointer">
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
                            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          />
                          <span className="text-sm font-medium text-gray-700">{item.localization}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Sort Options */}
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                    <span className="text-xl mr-2">🔄</span>
                    {t('common.sortBy')}
                  </h4>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    onChange={(e) => {
                      const [field, mode] = e.target.value.split('_');
                      handleSortChange(field, mode as OrderMode);
                    }}
                  >
                    <option value="">{t('common.noSort')}</option>
                    {availableSorts.map(sort => (
                      <React.Fragment key={sort}>
                        <option value={`${sort}_ASC`}>{sort} ↑</option>
                        <option value={`${sort}_DESC`}>{sort} ↓</option>
                      </React.Fragment>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              <div className="flex justify-end mt-6">
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  {t('common.clearFilters')}
                </button>
              </div>
            </div>
          )}

          {/* Data List */}
          <div className="space-y-4">
            {data.length === 0 ? (
              renderEmpty ? renderEmpty() : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📝</div>
                  <div className="text-gray-500 text-lg">{t('common.noData')}</div>
                </div>
              )
            ) : (
              data.map((item, index) => renderItem(item, index, getLocalizedValue))
            )}
          </div>

          {/* Pagination */}
          {showPagination && totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2 mt-8">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                ←
              </button>
              
              <div className="flex space-x-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={loading}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                          : 'bg-white/60 backdrop-blur-sm border border-white/30 hover:bg-white/80'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/30 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
              >
                →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AbstractDataList;
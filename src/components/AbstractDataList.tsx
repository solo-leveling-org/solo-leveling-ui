import React, { useState, useEffect, useCallback } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import DateFilter from './DateFilter';
import Icon from './Icon';
import type { 
  Filter,
  Sort,
  LocalizedField,
  ResponseQueryOptions,
  ResponsePaging
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
    paging?: ResponsePaging;
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
  // Удалено - теперь используем отдельные состояния для фильтров
  const [sorts, setSorts] = useState<Sort[]>([{ field: 'createdAt', mode: OrderMode.DESC }]);
  const { t } = useLocalization();

  // Состояния для фильтров
  const [dateFilters, setDateFilters] = useState<{from: string, to: string}>({from: '', to: ''});
  const [enumFilters, setEnumFilters] = useState<{[field: string]: string[]}>({});

  // Функция для получения локализованного значения enum поля
  const getLocalizedValue = (field: string, value: string): string => {
    const filter = availableFilters.find(f => f.field === field);
    if (!filter) return value;

    const item = filter.items.find(i => i.name === value);
    return item ? item.localization : value;
  };

  const loadDataCallback = useCallback(async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const currentFilters: Filter = {
        dateFilters: [],
        enumFilters: [],
      };

      // Date filters
      if (dateFilters.from && dateFilters.to) {
        currentFilters.dateFilters?.push({
          field: 'createdAt', // Хардкод как указано в требованиях
          range: {
            from: dateFilters.from,
            to: dateFilters.to,
          },
        });
      }

      // Enum filters
      Object.entries(enumFilters).forEach(([field, values]) => {
        if (values.length > 0) {
          currentFilters.enumFilters?.push({
            field: field,
            values: values, // Теперь отправляем строки (name)
          });
        }
      });

      // Отправляем на backend страницу с 0, но отображаем с 1
      const backendPage = page - 1;
      const result = await loadData(backendPage, pageSize, currentFilters, sorts);
      
      // Плавно обновляем данные без резких перемещений
      setData(result.data);
      setTotalPages(result.paging?.totalPageCount || 1);
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
  }, [loadData, pageSize, dateFilters, enumFilters, sorts, onDataLoad, t]);

  useEffect(() => {
    if (autoLoad) {
      loadDataCallback(currentPage);
    }
  }, [currentPage, loadDataCallback, autoLoad]);

  // Восстанавливаем сортировку по умолчанию при монтировании компонента
  useEffect(() => {
    if (sorts.length === 0) {
      setSorts([{ field: 'createdAt', mode: OrderMode.DESC }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDateRangeChange = (from: string, to: string) => {
    setDateFilters({ from, to });
    
    // Отправляем запрос только если обе даты заполнены
    if (from && to) {
      // Преобразуем даты в формат YYYY-MM-DD без времени
      // Фильтры дат теперь обрабатываются в loadDataCallback
      setCurrentPage(1);
    } else {
      // Фильтры дат теперь обрабатываются в loadDataCallback
    }
  };

  const handleEnumFilterChange = (field: string, values: string[]) => {
    setEnumFilters(prev => {
      const newFilters = {...prev, [field]: values};
      
      // Фильтры enum теперь обрабатываются в loadDataCallback
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
    setSorts([]);
    setDateFilters({from: '', to: ''});
    setEnumFilters({});
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
        <div className="mb-6">
          <button
            onClick={() => setShowFiltersPanel(!showFiltersPanel)}
            className="inline-flex items-center px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm font-medium"
          >
            <Icon type="search" size={16} className="mr-2" />
            {showFiltersPanel ? t('common.hideFilters') : t('common.showFilters')}
            <Icon 
              type={showFiltersPanel ? "minus" : "plus"} 
              size={14} 
              className="ml-2 transition-transform duration-200" 
            />
          </button>
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && showFiltersPanel && (
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 mb-6 border border-gray-200 shadow-lg transition-all duration-300 ease-in-out">
          <div className="space-y-6">
            {/* Date Range Filter */}
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                <Icon type="calendar" size={16} className="mr-2 text-blue-500" />
                {t('common.dateRange')}
              </label>
              <DateFilter
                from={dateFilters.from}
                to={dateFilters.to}
                onChange={handleDateRangeChange}
                className="w-full"
              />
            </div>

            {/* Enum Filters */}
            {availableFilters.map((filter) => (
              <div key={filter.field} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <Icon type="search" size={16} className="mr-2 text-purple-500" />
                  {filter.field}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {filter.items.map((item) => (
                    <label key={item.name} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200">
                      <input
                        type="checkbox"
                        checked={enumFilters[filter.field]?.includes(item.name) || false}
                        onChange={(e) => {
                          const currentValues = enumFilters[filter.field] || [];
                          const newValues = e.target.checked
                            ? [...currentValues, item.name]
                            : currentValues.filter(v => v !== item.name);
                          handleEnumFilterChange(filter.field, newValues);
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
            {availableSorts.length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center">
                  <Icon type="trending-up" size={16} className="mr-2 text-green-500" />
                  {t('common.sortBy')}
                </label>
                <div className="space-y-3">
                  {availableSorts.map((sort) => (
                    <div key={sort} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-gray-50">
                      <span className="text-sm font-medium text-gray-700 min-w-[100px]">
                        {t(`common.sortFields.${sort}`)}:
                      </span>
                      <select
                        value={sorts.find(s => s.field === sort)?.mode || ''}
                        onChange={(e) => handleSortChange(sort, e.target.value as OrderMode)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white hover:border-blue-400 transition-colors"
                      >
                        <option value="">{t('common.noSort')}</option>
                        <option value="ASC">{t('common.ascending')}</option>
                        <option value="DESC">{t('common.descending')}</option>
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Clear Filters Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 flex items-center"
              >
                <Icon type="minus" size={14} className="mr-2" />
                {t('common.clearFilters')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Display */}
      <div className="transition-all duration-300 ease-in-out">
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
          <div className="text-center py-8 text-red-500 transition-opacity duration-300">{error}</div>
        ) : data.length === 0 ? (
          renderEmpty ? renderEmpty() : (
            <div className="text-center py-8 transition-opacity duration-300">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-gray-500">{t('common.noData')}</div>
            </div>
          )
        ) : (
          <div className="space-y-3 transition-all duration-300 ease-in-out">
            {data.map((item, index) => renderItem(item, index, getLocalizedValue))}
          </div>
        )}

        {/* Pagination */}
        {showPagination && totalPages > 1 && (
          <div className="mt-6 flex justify-center transition-all duration-300 ease-in-out">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
              >
                ←
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-2 rounded-lg transition-all duration-200 text-sm ${
                    currentPage === page
                      ? 'bg-blue-500 text-white scale-105'
                      : 'bg-gray-100 hover:bg-gray-200 hover:scale-105'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm"
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
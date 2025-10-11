import React, { useState, useEffect, useCallback } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import type { 
  Filter,
  Sort,
  LocalizedField,
  ResponseQueryOptions
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
  renderItem: (item: T, index: number) => React.ReactNode;
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
  pageSize = 10,
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

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
    setCurrentPage(1);
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
    <div className={className}>
      {/* Filters and Controls */}
      {showFilters && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className="flex items-center px-3 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/80 transition-colors"
            >
              <span className="text-sm mr-2">🔍</span>
              <span className="text-sm font-medium">{t('common.filters')}</span>
            </button>
          </div>

          {showFiltersPanel && (
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/30 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date filters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('common.dateRange')}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                    />
                    <input
                      type="date"
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                    />
                  </div>
                </div>

                {/* Sort options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('common.sortBy')}
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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

              <div className="flex justify-end mt-4">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  {t('common.clearFilters')}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Data List */}
      <div className="space-y-3">
        {data.length === 0 ? (
          renderEmpty ? renderEmpty() : (
            <div className="text-center py-8">
              <div className="text-gray-500 mb-2">📝</div>
              <div className="text-gray-500">{t('common.noData')}</div>
            </div>
          )
        ) : (
          data.map((item, index) => renderItem(item, index))
        )}
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loading}
            className="px-3 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          
          <div className="flex space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={loading}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'bg-blue-500 text-white'
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
            className="px-3 py-2 bg-white/60 backdrop-blur-sm rounded-lg border border-white/30 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default AbstractDataList;

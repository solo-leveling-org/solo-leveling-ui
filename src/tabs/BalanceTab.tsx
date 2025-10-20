import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services';
import { useLocalization } from '../hooks/useLocalization';
import type { GetPlayerBalanceResponse, PlayerBalanceTransaction, LocalizedField } from '../api';
import BankingTransactionsList from '../components/BankingTransactionsList';
import Icon from '../components/Icon';
import FilterDropdown from '../components/FilterDropdown';
import DateFilter from '../components/DateFilter';

type BalanceTabProps = {
  isAuthenticated: boolean;
};

const BalanceTab: React.FC<BalanceTabProps> = ({ isAuthenticated }) => {
  const [balance, setBalance] = useState<GetPlayerBalanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateFilters, setDateFilters] = useState({ from: '', to: '' });
  const [enumFilters, setEnumFilters] = useState<{[field: string]: string[]}>({});
  const [availableFilters, setAvailableFilters] = useState<LocalizedField[]>([]);
  const { t } = useLocalization();

  const loadBalance = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const balanceData: GetPlayerBalanceResponse = await api.getPlayerBalance();
      setBalance(balanceData);
    } catch (err) {
      console.error('Error loading balance:', err);
      setError(t('common.error.loadingData'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  // Обработчики фильтров
  const handleDateFilterChange = useCallback((from: string, to: string) => {
    setDateFilters({ from, to });
  }, []);

  const handleEnumFilterChange = useCallback((field: string, values: string[]) => {
    setEnumFilters(prev => ({
      ...prev,
      [field]: values
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setDateFilters({ from: '', to: '' });
    setEnumFilters({});
  }, []);

  const handleFiltersUpdate = useCallback((filters: LocalizedField[]) => {
    setAvailableFilters(filters);
  }, []);

  // Загружаем баланс при монтировании компонента
  useEffect(() => {
    if (isAuthenticated) {
      loadBalance();
    }
  }, [isAuthenticated, loadBalance]);

  if (loading && !balance) {
    return <BalanceSkeleton />;
  }

  if (error) {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 via-orange-400/20 to-pink-400/20 rounded-3xl blur-3xl -z-10 transform scale-105"></div>
        <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 max-w-md mx-auto mt-8 text-center">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={loadBalance}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            {t('common.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (!balance) {
    return null;
  }

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {t('balance.title')}
        </h2>
        <p className="text-gray-600">{t('balance.subtitle')}</p>
      </div>

      {/* Current Balance - Mobile Banking Style with Glimmer */}
      <div className="relative overflow-hidden group">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-white/10 rounded-2xl"></div>
        
        {/* Glimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        {/* Additional shimmer elements */}
        <div className="absolute top-4 right-4 w-16 h-16 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 bg-white/5 rounded-full animate-pulse delay-300"></div>
        
        {/* Content */}
        <div className="relative p-6 text-white">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">{t('balance.totalBalance')}</p>
              <p className="text-blue-200 text-xs">{t('balance.currencyName')}</p>
            </div>
            <Icon type="coins" size={24} className="text-yellow-300" />
          </div>
          
          {/* Balance amount */}
          <div className="mb-4">
            <div className="text-4xl font-bold text-white mb-1">
              {balance.balance.balance.amount}
            </div>
            <div className="text-blue-200 text-sm font-medium">
              {balance.balance.balance.currencyCode}
            </div>
          </div>
          
          {/* Quick actions */}
          <div className="flex space-x-3">
            <button className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 text-white text-sm font-medium hover:bg-white/30 transition-all duration-200">
              {t('balance.topUp')}
            </button>
            <button className="flex-1 bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 text-white text-sm font-medium hover:bg-white/30 transition-all duration-200">
              {t('balance.transfer')}
            </button>
          </div>
        </div>
      </div>

        {/* Transactions */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {t('balance.transactions.title')}
            </h3>
          </div>

          {/* Фильтры - горизонтальная строка */}
          <div className="mb-6">
            {/* Горизонтальная прокручиваемая строка фильтров */}
            <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
              {/* Date Range Filter */}
              <div className="flex-shrink-0">
                <DateFilter
                  from={dateFilters.from}
                  to={dateFilters.to}
                  onChange={handleDateFilterChange}
                  className="min-w-[120px]"
                />
              </div>

              {/* Enum Filters */}
              {availableFilters.map((filter) => (
                <div key={filter.field} className="flex-shrink-0">
                  <FilterDropdown
                    label={filter.localization}
                    options={filter.items}
                    selectedValues={enumFilters[filter.field] || []}
                    onSelectionChange={(values) => handleEnumFilterChange(filter.field, values)}
                    className="min-w-[140px]"
                  />
                </div>
              ))}

              {/* Clear Filters Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={handleClearFilters}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 whitespace-nowrap"
                >
                  Сбросить
                </button>
              </div>
            </div>
          </div>

        <BankingTransactionsList
          dateFilters={dateFilters}
          enumFilters={enumFilters}
          onFiltersUpdate={handleFiltersUpdate}
          onTransactionsLoad={(transactions: PlayerBalanceTransaction[]) => {
            console.log('Transactions loaded:', transactions.length);
          }}
        />
      </div>
    </div>
  );
};

export const BalanceSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Header skeleton */}
    <div className="text-center">
      <div className="h-8 bg-gray-300 rounded-lg w-48 mx-auto mb-2 animate-pulse"></div>
      <div className="h-5 bg-gray-300 rounded-lg w-32 mx-auto animate-pulse"></div>
    </div>

    {/* Balance skeleton */}
    <div className="bg-gray-100 rounded-lg p-6 text-center animate-pulse">
      <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-3"></div>
      <div className="h-12 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
      <div className="h-6 bg-gray-300 rounded w-20 mx-auto"></div>
    </div>

    {/* Transactions skeleton */}
    <div>
      <div className="h-6 bg-gray-300 rounded w-32 mb-4 animate-pulse"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-100 rounded-lg p-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                <div>
                  <div className="h-4 bg-gray-300 rounded w-24 mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default BalanceTab;

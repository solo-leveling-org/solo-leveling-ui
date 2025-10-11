import React, { useState, useEffect } from 'react';
import { api } from '../services';
import { useLocalization } from '../hooks/useLocalization';
import type { GetPlayerBalanceResponse, PlayerBalanceTransaction } from '../api';
import TransactionsList from '../components/TransactionsList';

type BalanceTabProps = {
  isAuthenticated: boolean;
};

const BalanceTab: React.FC<BalanceTabProps> = ({ isAuthenticated }) => {
  const [balance, setBalance] = useState<GetPlayerBalanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocalization();

  // Загружаем баланс при монтировании компонента
  useEffect(() => {
    if (isAuthenticated) {
      loadBalance();
    }
  }, [isAuthenticated]);

  const loadBalance = async () => {
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
  };

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
    <div className="relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-orange-400/20 to-red-400/20 rounded-3xl blur-3xl -z-10 transform scale-105"></div>

      {/* Main card */}
      <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 max-w-2xl mx-auto mt-8 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-full blur-2xl -translate-y-8 translate-x-8"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-400/30 to-red-400/30 rounded-full blur-xl translate-y-4 -translate-x-4"></div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-4 shadow-lg">
              <span className="text-3xl">💰</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">
              {t('balance.title')}
            </h2>
            <p className="text-gray-600">{t('balance.subtitle')}</p>
          </div>

          {/* Current Balance */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-sm rounded-2xl p-6 border border-amber-200/30 text-center mb-8">
            <div className="text-2xl mb-3">💰</div>
            <div className="text-4xl font-bold text-amber-700 mb-2">
              {balance.balance.balance.amount}
            </div>
            <div className="text-lg text-amber-600 font-medium">
              {balance.balance.balance.currencyCode}
            </div>
          </div>

          {/* Transactions */}
          <TransactionsList
            onTransactionsLoad={(transactions: PlayerBalanceTransaction[]) => {
              // Можно добавить логику обработки загруженных транзакций
              console.log('Transactions loaded:', transactions.length);
            }}
            className="mt-6"
          />
        </div>
      </div>
    </div>
  );
};

export const BalanceSkeleton: React.FC = () => (
  <div className="relative">
    {/* Background gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-orange-400/20 to-red-400/20 rounded-3xl blur-3xl -z-10 transform scale-105"></div>

    {/* Main card */}
    <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 max-w-2xl mx-auto mt-8 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-full blur-2xl -translate-y-8 translate-x-8 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-400/30 to-red-400/30 rounded-full blur-xl translate-y-4 -translate-x-4 animate-pulse"></div>

      {/* Content skeleton */}
      <div className="relative z-10">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div className="h-8 bg-gray-300 rounded-lg w-48 mx-auto mb-2 animate-pulse"></div>
          <div className="h-5 bg-gray-300 rounded-lg w-32 mx-auto animate-pulse"></div>
        </div>

        {/* Balance skeleton */}
        <div className="bg-gray-200/50 backdrop-blur-sm rounded-2xl p-6 mb-8 text-center animate-pulse">
          <div className="w-8 h-8 bg-gray-300 rounded mx-auto mb-3"></div>
          <div className="h-12 bg-gray-300 rounded w-32 mx-auto mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-20 mx-auto"></div>
        </div>

        {/* Transactions skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200/50 backdrop-blur-sm rounded-xl p-4 animate-pulse">
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
  </div>
);

export default BalanceTab;

import React from 'react';
import { api } from '../services';
import { useLocalization } from '../hooks/useLocalization';
import AbstractDataList, { DataItem } from './AbstractDataList';
import type { 
  PlayerBalanceTransaction, 
  SearchPlayerBalanceTransactionsRequest,
  Filter,
  Sort
} from '../api';

// Расширяем базовый тип для транзакций
interface TransactionItem extends DataItem {
  id: string;
  version: number;
  amount: {
    amount: number;
    currencyCode: string;
  };
  type: 'IN' | 'OUT';
  cause: string;
  createdAt: string;
}

type TransactionsListProps = {
  onTransactionsLoad?: (transactions: PlayerBalanceTransaction[]) => void;
  className?: string;
};

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  onTransactionsLoad, 
  className = '' 
}) => {
  const { t } = useLocalization();

  // Метод загрузки данных для абстрактного компонента
  const loadTransactions = async (
    page: number, 
    pageSize: number, 
    filters?: Filter, 
    sorts?: Sort[]
  ) => {
    const request: SearchPlayerBalanceTransactionsRequest = {
      options: {
        filter: filters,
        sorts: sorts
      }
    };

    const response = await api.searchPlayerBalanceTransactions(request, page, pageSize);
    
    return {
      data: response.transactions as TransactionItem[],
      options: response.options
    };
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Получение иконки для транзакции
  const getTransactionIcon = (type: string, cause: string) => {
    if (type === 'IN') {
      switch (cause) {
        case 'TASK_COMPLETION':
          return '✅';
        case 'LEVEL_UP':
          return '🎉';
        case 'DAILY_CHECK_IN':
          return '📅';
        default:
          return '💰';
      }
    } else {
      return '🛒';
    }
  };

  // Получение цвета для транзакции
  const getTransactionColor = (type: string) => {
    return type === 'IN' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionBgColor = (type: string) => {
    return type === 'IN' ? 'bg-green-100' : 'bg-red-100';
  };

  // Рендер элемента транзакции
  const renderTransaction = (transaction: TransactionItem, index: number, getLocalizedValue: (field: string, value: string) => string) => (
    <div
      key={transaction.id}
      className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 hover:shadow-lg transition-all duration-300"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-8 h-8 ${getTransactionBgColor(transaction.type)} rounded-full flex items-center justify-center`}>
            <span className="text-sm">{getTransactionIcon(transaction.type, transaction.cause)}</span>
          </div>
          <div>
            <div className="text-sm font-medium text-gray-800">
              {getLocalizedValue('cause', transaction.cause)}
            </div>
            <div className="text-xs text-gray-500">
              {formatDate(transaction.createdAt)}
            </div>
          </div>
        </div>
        <div className={`text-sm font-bold ${getTransactionColor(transaction.type)}`}>
          <div className="flex items-center space-x-2">
            <span>{transaction.type === 'IN' ? '+' : '-'}{transaction.amount.amount} {transaction.amount.currencyCode}</span>
            <span className="text-xs opacity-75">({getLocalizedValue('type', transaction.type)})</span>
          </div>
        </div>
      </div>
    </div>
  );

  // Рендер скелетона
  const renderSkeleton = () => (
    <>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/30 animate-pulse">
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
    </>
  );

  // Рендер пустого состояния
  const renderEmpty = () => (
    <div className="text-center py-8">
      <div className="text-gray-500 mb-2">📝</div>
      <div className="text-gray-500">{t('balance.transactions.empty')}</div>
    </div>
  );

  return (
    <AbstractDataList<TransactionItem>
      loadData={loadTransactions}
      renderItem={renderTransaction}
      renderSkeleton={renderSkeleton}
      renderEmpty={renderEmpty}
      onDataLoad={(transactions) => {
        if (onTransactionsLoad) {
          onTransactionsLoad(transactions as PlayerBalanceTransaction[]);
        }
      }}
      className={className}
      pageSize={5}
      showFilters={true}
      showPagination={true}
      autoLoad={true}
    />
  );
};

export default TransactionsList;
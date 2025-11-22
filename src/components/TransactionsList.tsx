import React from 'react';
import { api } from '../services';
import { useLocalization } from '../hooks/useLocalization';
import AbstractDataList, { DataItem } from './AbstractDataList';
import Icon from './Icon';
import type { 
  PlayerBalanceTransaction, 
  SearchRequest,
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
    const request: SearchRequest = {
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
          return <Icon type="plus" size={16} />;
        case 'LEVEL_UP':
          return <Icon type="star" size={16} />;
        case 'DAILY_CHECK_IN':
          return <Icon type="calendar" size={16} />;
        default:
          return <Icon type="plus" size={16} />;
      }
    } else {
      return <Icon type="minus" size={16} />;
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
    className="group bg-gradient-to-r from-white to-gray-50 rounded-xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.01] hover:-translate-y-1"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 ${getTransactionBgColor(transaction.type)} rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow duration-300`}>
          <span className="text-lg">{getTransactionIcon(transaction.type, transaction.cause)}</span>
        </div>
        <div className="flex-1">
          <div className="text-base font-semibold text-gray-800 group-hover:text-blue-700 transition-colors duration-200">
            {getLocalizedValue('cause', transaction.cause)}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {formatDate(transaction.createdAt)}
          </div>
        </div>
      </div>
      <div className={`text-lg font-bold ${getTransactionColor(transaction.type)} group-hover:scale-105 transition-transform duration-200`}>
        <div className="flex items-center space-x-1">
          <span className="text-2xl">{transaction.type === 'IN' ? '+' : '-'}</span>
          <span>{transaction.amount.amount}</span>
          <span className="text-sm font-medium text-gray-600 ml-1">{transaction.amount.currencyCode}</span>
        </div>
      </div>
    </div>
  </div>
);

  // Рендер скелетона
  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl p-5 border border-gray-200 animate-pulse">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-300 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-300 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-20"></div>
              </div>
            </div>
            <div className="h-6 bg-gray-300 rounded w-20"></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Рендер пустого состояния
  const renderEmpty = () => (
    <div className="text-center py-12">
      <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 max-w-md mx-auto">
        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon type="coins" size={32} className="text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('balance.transactions.empty')}</h3>
        <p className="text-gray-500 text-sm">Complete tasks to earn rewards!</p>
      </div>
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
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { api } from '../services';
import Icon from './Icon';
import type { 
  PlayerBalanceTransaction, 
  SearchPlayerBalanceTransactionsRequest,
  SearchPlayerBalanceTransactionsResponse,
  LocalizedField,
  OrderMode
} from '../api';

type TransactionItem = PlayerBalanceTransaction;

interface BankingTransactionsListProps {
  onTransactionsLoad?: (transactions: PlayerBalanceTransaction[]) => void;
}

interface TransactionGroup {
  date: string;
  displayDate: string;
  transactions: TransactionItem[];
}

const BankingTransactionsList: React.FC<BankingTransactionsListProps> = ({ 
  onTransactionsLoad 
}) => {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [groups, setGroups] = useState<TransactionGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [availableFilters, setAvailableFilters] = useState<LocalizedField[]>([]);
  const [, setAvailableSorts] = useState<string[]>([]);
  const [dateFilters] = useState({ from: '', to: '' });
  const [enumFilters] = useState<{[field: string]: string[]}>({});
  const [sorts] = useState<{field: string, mode: OrderMode}[]>([]);
  
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const currentPageRef = useRef(0);
  const hasMoreRef = useRef(true);
  const isLoadingRef = useRef(false);
  
  const { t } = useLocalization();

  // Форматирование даты для группировки
  const formatDateForGroup = useCallback((dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const transactionDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // Сегодня
    if (transactionDate.getTime() === today.getTime()) {
      return t('common.today');
    }
    
    // Вчера
    if (transactionDate.getTime() === yesterday.getTime()) {
      return t('common.yesterday');
    }
    
    // Недавние месяцы (до 2 месяцев назад)
    const twoMonthsAgo = new Date(today);
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    
    if (transactionDate > twoMonthsAgo) {
      // Формат "15 октября"
      const day = date.getDate();
      const monthNames = [
        t('common.months.january'), t('common.months.february'), t('common.months.march'),
        t('common.months.april'), t('common.months.may'), t('common.months.june'),
        t('common.months.july'), t('common.months.august'), t('common.months.september'),
        t('common.months.october'), t('common.months.november'), t('common.months.december')
      ];
      return `${day} ${monthNames[date.getMonth()]}`;
    }
    
    // Старые месяцы - только месяц и год
    const monthNames = [
      t('common.months.january'), t('common.months.february'), t('common.months.march'),
      t('common.months.april'), t('common.months.may'), t('common.months.june'),
      t('common.months.july'), t('common.months.august'), t('common.months.september'),
      t('common.months.october'), t('common.months.november'), t('common.months.december')
    ];
    
    const currentYear = now.getFullYear();
    const transactionYear = date.getFullYear();
    
    if (transactionYear === currentYear) {
      return monthNames[date.getMonth()];
    } else {
      return `${monthNames[date.getMonth()]} ${transactionYear}`;
    }
  }, [t]);

  // Группировка транзакций по датам
  const groupTransactionsByDate = useCallback((transactions: TransactionItem[]): TransactionGroup[] => {
    const groups: {[key: string]: TransactionItem[]} = {};
    
    transactions.forEach(transaction => {
      const dateKey = new Date(transaction.createdAt).toDateString();
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(transaction);
    });
    
    return Object.keys(groups)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
      .map(dateKey => ({
        date: dateKey,
        displayDate: formatDateForGroup(groups[dateKey][0].createdAt),
        transactions: groups[dateKey].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      }));
  }, [formatDateForGroup]);

  // Загрузка транзакций
  const loadTransactions = useCallback(async (page: number = 0, reset: boolean = false) => {
    if (isLoadingRef.current) return;
    
    // Дополнительная защита: не загружаем если данных больше нет
    if (!reset && !hasMoreRef.current) return;
    
    isLoadingRef.current = true;
    
    if (reset) {
      setLoading(true);
      currentPageRef.current = 0;
    } else {
      setLoadingMore(true);
    }
    
    setError(null);

    try {
      const request: SearchPlayerBalanceTransactionsRequest = {
        options: {
          filter: {
            dateFilters: dateFilters.from && dateFilters.to ? [{
              field: 'createdAt',
              from: dateFilters.from,
              to: dateFilters.to
            }] : undefined,
            enumFilters: Object.keys(enumFilters).length > 0 ? 
              Object.entries(enumFilters).map(([field, values]) => ({
                field,
                values: values
              })) : undefined
          },
          sorts: sorts.length > 0 ? sorts : undefined
        }
      };

      const response: SearchPlayerBalanceTransactionsResponse = await api.searchPlayerBalanceTransactions(
        request,
        page,
        20 // pageSize
      );
      
      const newTransactions = response.transactions || [];
      const hasMoreData = response.options?.hasMore || false;
      
      console.log('Loading transactions:', {
        page,
        newTransactionsCount: newTransactions.length,
        hasMore: hasMoreData,
        currentPage: response.options?.currentPage,
        totalPages: response.options?.totalPageCount,
        responseOptions: response.options
      });
      
      if (reset) {
        setTransactions(newTransactions);
        setHasMore(hasMoreData);
        currentPageRef.current = 0;
      } else {
        setTransactions(prev => [...prev, ...newTransactions]);
        setHasMore(hasMoreData);
        currentPageRef.current = page;
      }
      
      // Обновляем ref сразу после установки состояния
      hasMoreRef.current = hasMoreData;
      
      // Обновляем фильтры и сортировки
      if (response.options) {
        setAvailableFilters(response.options.filters || []);
        setAvailableSorts(response.options.sorts || []);
      }
      
      onTransactionsLoad?.(newTransactions);
      
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError(t('common.error.loadingData'));
    } finally {
      setLoading(false);
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [dateFilters, enumFilters, sorts, t, onTransactionsLoad]);


  // Настройка Intersection Observer для бесконечного скролла
  useEffect(() => {
    console.log('Setting up Intersection Observer:', {
      hasMore,
      hasMoreRef: hasMoreRef.current,
      loadingMore
    });
    
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Не создаем observer если данных больше нет
    if (!hasMoreRef.current) {
      console.log('Not creating observer - no more data');
      return;
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      console.log('Intersection Observer callback:', {
        isIntersecting: entries[0].isIntersecting,
        hasMoreRef: hasMoreRef.current,
        loadingMore,
        isLoading: isLoadingRef.current,
        currentPage: currentPageRef.current
      });
      
      if (entries[0].isIntersecting && hasMoreRef.current && !loadingMore && !isLoadingRef.current) {
        const nextPage = currentPageRef.current + 1;
        console.log('Intersection Observer triggered:', {
          currentPage: currentPageRef.current,
          nextPage,
          hasMore: hasMoreRef.current,
          loadingMore,
          isLoading: isLoadingRef.current
        });
        loadTransactions(nextPage);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersection, { threshold: 0.1 });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loadingMore, loadTransactions]);

  // Загрузка при монтировании
  useEffect(() => {
    loadTransactions(0, true);
  }, [loadTransactions]);

  // Обновление групп при изменении транзакций
  useEffect(() => {
    setGroups(groupTransactionsByDate(transactions));
  }, [transactions, groupTransactionsByDate]);

  // Получение иконки для транзакции
  const getTransactionIcon = (type: string, cause: string) => {
    if (type === 'IN') {
      switch (cause) {
        case 'TASK_COMPLETION':
          return <Icon type="plus" size={20} />;
        case 'LEVEL_UP':
          return <Icon type="star" size={20} />;
        case 'DAILY_CHECK_IN':
          return <Icon type="calendar" size={20} />;
        default:
          return <Icon type="plus" size={20} />;
      }
    } else {
      return <Icon type="minus" size={20} />;
    }
  };

  // Получение цвета для транзакции
  const getTransactionColor = (type: string) => {
    return type === 'IN' ? 'text-green-600' : 'text-red-600';
  };

  const getTransactionBgColor = (type: string) => {
    return type === 'IN' ? 'bg-green-50' : 'bg-red-50';
  };

  // Форматирование времени
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Получение локализованного значения
  const getLocalizedValue = (field: string, value: string): string => {
    const filter = availableFilters.find(f => f.field === field);
    if (filter) {
      const item = filter.items.find(i => i.name === value);
      return item ? item.localization : value;
    }
    return value;
  };

  // Рендер пустого состояния
  const renderEmpty = () => (
    <div className="text-center py-12">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 max-w-md mx-auto">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Icon type="coins" size={32} className="text-blue-500" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('balance.transactions.empty')}</h3>
        <p className="text-gray-500 text-sm">Complete tasks to earn rewards!</p>
      </div>
    </div>
  );

  if (loading && transactions.length === 0) {
    return (
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
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={() => loadTransactions()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {t('common.retry')}
        </button>
      </div>
    );
  }

  if (transactions.length === 0) {
    return renderEmpty();
  }

  return (
    <div className="space-y-6">
      {/* Группы транзакций */}
      {groups.map((group, groupIndex) => (
        <div key={group.date}>
          {/* Заголовок группы */}
          <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 py-2 mb-3">
            <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              {group.displayDate}
            </h3>
          </div>
          
          {/* Транзакции группы */}
          <div className="space-y-2">
            {group.transactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="group bg-white rounded-xl p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${getTransactionBgColor(transaction.type)} rounded-xl flex items-center justify-center`}>
                      {getTransactionIcon(transaction.type, transaction.cause)}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {getLocalizedValue('cause', transaction.cause)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {formatTime(transaction.createdAt)}
                      </div>
                    </div>
                  </div>
                  <div className={`text-right ${getTransactionColor(transaction.type)}`}>
                    <div className="text-sm font-semibold">
                      {transaction.type === 'IN' ? '+' : '-'}{transaction.amount.amount}
                    </div>
                    <div className="text-xs text-gray-500">
                      {transaction.amount.currencyCode}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Индикатор загрузки */}
      {loadingMore && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Элемент для отслеживания скролла - только если есть еще данные */}
      {hasMore && <div ref={loadMoreRef} className="h-1" />}
    </div>
  );
};

export default BankingTransactionsList;

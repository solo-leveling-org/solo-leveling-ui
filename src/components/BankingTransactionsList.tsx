import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useLocalization } from '../hooks/useLocalization';
import { api } from '../services';
import Icon from './Icon';
import type { 
  PlayerBalanceTransaction, 
  SearchRequest,
  SearchPlayerBalanceTransactionsResponse,
  LocalizedField,
  OrderMode
} from '../api';

type TransactionItem = PlayerBalanceTransaction;

interface BankingTransactionsListProps {
  onTransactionsLoad?: (transactions: PlayerBalanceTransaction[]) => void;
  dateFilters?: { from: string; to: string };
  enumFilters?: {[field: string]: string[]};
  onFiltersUpdate?: (filters: LocalizedField[]) => void;
}

interface TransactionGroup {
  date: string;
  displayDate: string;
  transactions: TransactionItem[];
}

const BankingTransactionsList: React.FC<BankingTransactionsListProps> = ({ 
  onTransactionsLoad,
  dateFilters: propDateFilters,
  enumFilters: propEnumFilters,
  onFiltersUpdate
}) => {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [groups, setGroups] = useState<TransactionGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [availableFilters, setAvailableFilters] = useState<LocalizedField[]>([]);
  const [, setAvailableSorts] = useState<string[]>([]);
  
  // Используем переданные фильтры или значения по умолчанию
  const dateFilters = useMemo(() => propDateFilters || { from: '', to: '' }, [propDateFilters]);
  const enumFilters = useMemo(() => propEnumFilters || {}, [propEnumFilters]);
  const sorts: {field: string, mode: OrderMode}[] = useMemo(() => [], []);
  
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
      const request: SearchRequest = {
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
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Не создаем observer если данных больше нет
    if (!hasMoreRef.current) {
      return;
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMoreRef.current && !loadingMore && !isLoadingRef.current) {
        const nextPage = currentPageRef.current + 1;
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
  }, [hasMore, loadingMore]); // eslint-disable-line react-hooks/exhaustive-deps

  // Загрузка при монтировании
  useEffect(() => {
    loadTransactions(0, true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Перезагрузка при изменении фильтров
  useEffect(() => {
    if (dateFilters || enumFilters) {
      loadTransactions(0, true);
    }
  }, [dateFilters, enumFilters]); // eslint-disable-line react-hooks/exhaustive-deps

  // Обновление групп при изменении транзакций
  useEffect(() => {
    setGroups(groupTransactionsByDate(transactions));
  }, [transactions, groupTransactionsByDate]);

  // Обновление доступных фильтров
  useEffect(() => {
    if (availableFilters.length > 0) {
      onFiltersUpdate?.(availableFilters);
    }
  }, [availableFilters]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Получение цвета для транзакции (удалено, теперь используется inline стиль)


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
      <div 
        className="relative overflow-hidden rounded-2xl md:rounded-3xl p-8 max-w-md mx-auto"
        style={{
          background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(220, 235, 245, 0.2)',
          boxShadow: '0 0 20px rgba(180, 220, 240, 0.15), inset 0 0 20px rgba(200, 230, 245, 0.03)'
        }}
      >
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{
            background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(234, 179, 8, 0.1) 100%)',
            border: '2px solid rgba(234, 179, 8, 0.3)'
          }}
        >
          <div
            style={{
              color: 'rgba(234, 179, 8, 0.9)',
              filter: 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.6))'
            }}
          >
            <Icon type="coins" size={32} />
          </div>
        </div>
        <h3 
          className="text-lg font-tech font-semibold mb-2"
          style={{
            color: '#e8f4f8',
            textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
          }}
        >
          {t('balance.transactions.empty')}
        </h3>
        <p 
          className="text-sm font-tech"
          style={{
            color: 'rgba(220, 235, 245, 0.7)'
          }}
        >
          Complete tasks to earn rewards!
        </p>
      </div>
    </div>
  );

  if (loading && transactions.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div 
            key={i} 
            className="rounded-xl p-5 animate-pulse"
            style={{
              background: 'rgba(220, 235, 245, 0.05)',
              border: '1px solid rgba(220, 235, 245, 0.1)'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div 
                  className="w-12 h-12 rounded-xl"
                  style={{
                    background: 'rgba(220, 235, 245, 0.1)'
                  }}
                ></div>
                <div className="flex-1">
                  <div 
                    className="h-5 rounded w-32 mb-2"
                    style={{
                      background: 'rgba(220, 235, 245, 0.1)'
                    }}
                  ></div>
                  <div 
                    className="h-4 rounded w-20"
                    style={{
                      background: 'rgba(220, 235, 245, 0.08)'
                    }}
                  ></div>
                </div>
              </div>
              <div 
                className="h-6 rounded w-20"
                style={{
                  background: 'rgba(220, 235, 245, 0.1)'
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div 
          className="mb-4 font-tech font-semibold"
          style={{
            color: '#e8f4f8',
            textShadow: '0 0 8px rgba(220, 38, 38, 0.3)'
          }}
        >
          {error}
        </div>
        <button
          onClick={() => loadTransactions()}
          className="px-4 py-2 rounded-xl font-tech font-semibold transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(180, 220, 240, 0.15) 0%, rgba(160, 210, 235, 0.08) 100%)',
            border: '1px solid rgba(180, 220, 240, 0.4)',
            color: '#e8f4f8',
            boxShadow: '0 0 15px rgba(180, 220, 240, 0.3)',
            textShadow: '0 0 4px rgba(180, 220, 240, 0.2)'
          }}
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
    <div className="select-none space-y-6 custom-scrollbar">
      {/* Группы транзакций в стиле Solo Leveling */}
      {groups.map((group, groupIndex) => (
        <div 
          key={group.date} 
          className="relative overflow-hidden rounded-2xl md:rounded-3xl"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(220, 235, 245, 0.2)',
            boxShadow: '0 0 20px rgba(180, 220, 240, 0.15), inset 0 0 20px rgba(200, 230, 245, 0.03)'
          }}
        >
          {/* Glowing orbs */}
          <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full blur-xl opacity-10" style={{
            background: 'rgba(180, 216, 232, 0.8)'
          }}></div>
          <div className="absolute -bottom-2 -left-2 w-12 h-12 rounded-full blur-lg opacity-10" style={{
            background: 'rgba(200, 230, 245, 0.6)'
          }}></div>

          {/* Заголовок группы */}
          <div 
            className="relative z-10 sticky top-0 py-4 px-6 select-none"
            style={{
              background: 'rgba(10, 14, 39, 0.7)',
              backdropFilter: 'blur(10px)',
              borderBottom: '1px solid rgba(220, 235, 245, 0.1)'
            }}
          >
            <div className="flex items-center justify-between">
              <h3 
                className="text-base md:text-lg font-tech font-semibold select-text" 
                data-text="true"
                style={{
                  color: '#e8f4f8',
                  textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
                }}
              >
                {group.displayDate}
              </h3>
              <span 
                className="text-base md:text-lg font-tech font-semibold select-text" 
                data-text="true"
                style={{
                  color: 'rgba(234, 179, 8, 0.9)',
                  textShadow: '0 0 8px rgba(234, 179, 8, 0.4)'
                }}
              >
                {group.transactions.reduce((sum, t) => sum + (t.type === 'IN' ? t.amount.amount : -t.amount.amount), 0)} {group.transactions[0]?.amount.currencyCode || ''}
              </span>
            </div>
          </div>
          
          {/* Транзакции группы */}
          <div className="relative z-10 divide-y" style={{ borderColor: 'rgba(220, 235, 245, 0.1)' }}>
            {group.transactions.map((transaction, index) => (
              <div
                key={transaction.id}
                className="flex items-center py-5 px-6 transition-all duration-200 select-none hover:bg-opacity-10"
                style={{
                  background: index % 2 === 0 ? 'transparent' : 'rgba(220, 235, 245, 0.02)'
                }}
              >
                <div className="flex items-center space-x-4 flex-1 min-w-0">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      background: transaction.type === 'IN' 
                        ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(22, 163, 74, 0.1) 100%)'
                        : 'linear-gradient(135deg, rgba(220, 38, 38, 0.2) 0%, rgba(185, 28, 28, 0.1) 100%)',
                      border: `2px solid ${transaction.type === 'IN' ? 'rgba(34, 197, 94, 0.3)' : 'rgba(220, 38, 38, 0.3)'}`
                    }}
                  >
                    <div
                      style={{
                        color: transaction.type === 'IN' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(220, 38, 38, 0.9)',
                        filter: `drop-shadow(0 0 4px ${transaction.type === 'IN' ? 'rgba(34, 197, 94, 0.5)' : 'rgba(220, 38, 38, 0.5)'})`
                      }}
                    >
                      {getTransactionIcon(transaction.type, transaction.cause)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div 
                      className="text-base font-tech font-medium truncate select-text" 
                      data-text="true"
                      style={{
                        color: '#e8f4f8',
                        textShadow: '0 0 4px rgba(180, 220, 240, 0.2)'
                      }}
                    >
                      {getLocalizedValue('cause', transaction.cause)}
                    </div>
                    <div 
                      className="text-sm font-tech select-text" 
                      data-text="true"
                      style={{
                        color: 'rgba(220, 235, 245, 0.7)'
                      }}
                    >
                      {formatTime(transaction.createdAt)}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div 
                    className="text-base font-tech font-semibold select-text" 
                    data-text="true"
                    style={{
                      color: transaction.type === 'IN' ? 'rgba(34, 197, 94, 0.9)' : 'rgba(220, 38, 38, 0.9)',
                      textShadow: `0 0 6px ${transaction.type === 'IN' ? 'rgba(34, 197, 94, 0.4)' : 'rgba(220, 38, 38, 0.4)'}`
                    }}
                  >
                    {transaction.type === 'IN' ? '+' : ''}{transaction.amount.amount} {transaction.amount.currencyCode}
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
          <div 
            className="animate-spin rounded-full h-6 w-6 border-2"
            style={{
              borderColor: 'rgba(220, 235, 245, 0.2)',
              borderTopColor: 'rgba(180, 220, 240, 0.6)'
            }}
          ></div>
        </div>
      )}

      {/* Элемент для отслеживания скролла - только если есть еще данные */}
      {hasMore && <div ref={loadMoreRef} className="h-1" />}
    </div>
  );
};

export default BankingTransactionsList;

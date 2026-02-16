import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services';
import { useLocalization } from '../hooks/useLocalization';
import type { GetPlayerBalanceResponse, PlayerBalanceTransaction, LocalizedField } from '../api';
import BankingTransactionsList from '../components/BankingTransactionsList';
import Icon from '../components/Icon';
import FilterDropdown from '../components/FilterDropdown';
import DateFilter from '../components/DateFilter';
import ResetFiltersButton from '../components/ResetFiltersButton';

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
  const [contentLoaded, setContentLoaded] = useState(false);
  const [balanceLoaded, setBalanceLoaded] = useState(false);
  const { t } = useLocalization();

  // Устанавливаем contentLoaded сразу при монтировании, чтобы контент был виден
  useEffect(() => {
    setTimeout(() => {
      setContentLoaded(true);
    }, 50);
  }, []);

  const loadBalance = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const balanceData: GetPlayerBalanceResponse = await api.getPlayerBalance();
      setBalance(balanceData);
      // Запускаем анимацию появления баланса
      setTimeout(() => {
        setBalanceLoaded(true);
      }, 50);
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

  // Показываем ошибку только если она есть и баланс не загружен
  if (error && !balance) {
    return (
      <div
        className="fixed inset-0 overflow-y-auto overflow-x-hidden flex items-center justify-center px-4"
        style={{
          background: 'linear-gradient(135deg, #000000 0%, #0a0e1a 50%, #0d1220 100%)',
          boxSizing: 'border-box',
        }}
      >
        <div 
          className="relative rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.95) 0%, rgba(5, 8, 18, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(220, 38, 38, 0.3)',
            boxShadow: `
              0 0 30px rgba(220, 38, 38, 0.2),
              inset 0 0 30px rgba(200, 230, 245, 0.03)
            `
          }}
        >
          <div 
            className="text-center mb-6 font-tech font-semibold"
            style={{
              color: '#e8f4f8',
              textShadow: '0 0 8px rgba(220, 38, 38, 0.3)'
            }}
          >
            {error}
          </div>
          <button
            onClick={loadBalance}
            className="w-full px-6 py-3 font-tech font-semibold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95"
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
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 overflow-y-auto overflow-x-hidden ${contentLoaded ? 'tab-content-enter-active' : ''}`}
      style={{
        background: 'linear-gradient(135deg, #000000 0%, #0a0e1a 50%, #0d1220 100%)',
        boxSizing: 'border-box',
        opacity: contentLoaded ? 1 : 0,
        transform: contentLoaded ? 'translateY(0)' : 'translateY(10px)',
        transition: contentLoaded ? 'opacity 0.4s ease-out, transform 0.4s ease-out' : 'none',
        touchAction: 'pan-y',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {/* Holographic grid background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(200, 230, 245, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 230, 245, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: 'perspective(500px) rotateX(60deg)',
          transformOrigin: 'center center'
        }}></div>
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15" style={{
        background: 'rgba(180, 216, 232, 0.8)'
      }}></div>
      <div className="absolute bottom-1/3 right-1/3 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-10" style={{
        background: 'rgba(200, 230, 245, 0.6)'
      }}></div>

      <div className="tab-inner-content relative z-10 min-h-screen pt-16 md:pt-20 px-4 md:px-6 pb-24">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-tech font-bold mb-3 tracking-tight"
            style={{
              color: '#e8f4f8',
              textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
            }}
          >
            {t('balance.title')}
          </h1>
          <p
            className="mb-6 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto px-4"
            style={{
              color: 'rgba(220, 235, 245, 0.7)',
              textShadow: '0 0 4px rgba(180, 220, 240, 0.1)'
            }}
          >
            {t('balance.subtitle')}
          </p>
          <div
            className="w-24 sm:w-32 md:w-40 h-1 rounded-full mx-auto"
            style={{
              background: 'rgba(180, 220, 240, 0.6)',
              boxShadow: '0 0 8px rgba(180, 220, 240, 0.4)'
            }}
          ></div>
        </div>

        {/* Current Balance Card - Solo Leveling Style */}
        <div className="flex justify-center mb-8">
          {loading && !balance ? (
            // Skeleton для баланса
            <div 
              className="relative overflow-hidden rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full animate-pulse"
              style={{
                background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(220, 235, 245, 0.2)',
                boxShadow: '0 0 20px rgba(180, 220, 240, 0.15), inset 0 0 20px rgba(200, 230, 245, 0.03)'
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-2">
                  <div 
                    className="h-4 w-24 rounded"
                    style={{
                      background: 'rgba(220, 235, 245, 0.1)'
                    }}
                  ></div>
                  <div 
                    className="h-3 w-16 rounded"
                    style={{
                      background: 'rgba(220, 235, 245, 0.08)'
                    }}
                  ></div>
                </div>
                <div 
                  className="w-7 h-7 rounded-lg"
                  style={{
                    background: 'rgba(220, 235, 245, 0.1)'
                  }}
                ></div>
              </div>
              <div className="mb-6">
                <div 
                  className="h-12 w-32 rounded mb-2"
                  style={{
                    background: 'rgba(220, 235, 245, 0.1)'
                  }}
                ></div>
                <div 
                  className="h-5 w-20 rounded"
                  style={{
                    background: 'rgba(220, 235, 245, 0.08)'
                  }}
                ></div>
              </div>
            </div>
          ) : balance ? (
            <div 
              className="relative overflow-hidden rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full group"
              style={{
                background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                border: '2px solid rgba(220, 235, 245, 0.2)',
                boxShadow: `
                  0 0 20px rgba(180, 220, 240, 0.15),
                  inset 0 0 20px rgba(200, 230, 245, 0.03)
                `,
                opacity: balanceLoaded ? 1 : 0,
                transform: balanceLoaded ? 'translateY(0)' : 'translateY(10px)',
                transition: 'opacity 0.3s ease-out, transform 0.3s ease-out'
              }}
            >
              {/* Glowing orbs */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full blur-2xl opacity-10 animate-float" style={{
                background: 'rgba(180, 220, 240, 0.8)'
              }}></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full blur-xl opacity-10 animate-float-delayed" style={{
                background: 'rgba(180, 220, 240, 0.6)'
              }}></div>
              
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p 
                      className="text-xs md:text-sm font-tech mb-1"
                      style={{
                        color: 'rgba(220, 235, 245, 0.7)',
                        textShadow: '0 0 2px rgba(180, 220, 240, 0.2)'
                      }}
                    >
                      {t('balance.totalBalance')}
                    </p>
                    <p 
                      className="text-[10px] md:text-xs font-tech"
                      style={{
                        color: 'rgba(220, 235, 245, 0.6)'
                      }}
                    >
                      {t('balance.currencyName')}
                    </p>
                  </div>
                  <div
                    className="profile-icon-wrapper"
                    style={{
                      color: 'rgba(180, 220, 240, 0.9)',
                      filter: 'drop-shadow(0 0 8px rgba(180, 220, 240, 0.6))'
                    }}
                  >
                    <Icon type="coins" size={28} />
                  </div>
                </div>
                
                {/* Balance amount */}
                <div className="mb-6">
                  <div 
                    className="text-4xl md:text-5xl font-tech font-bold mb-2"
                    style={{
                      color: '#e8f4f8',
                      textShadow: '0 0 12px rgba(180, 220, 240, 0.4)'
                    }}
                  >
                    {balance.balance.balance.amount}
                  </div>
                  <div 
                    className="text-sm md:text-base font-tech font-semibold"
                    style={{
                      color: 'rgba(180, 220, 240, 0.8)',
                      textShadow: '0 0 6px rgba(180, 220, 240, 0.3)'
                    }}
                  >
                    {balance.balance.balance.currencyCode}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Transactions Section */}
        <div className="flex justify-center">
          <div className="max-w-4xl w-full">
            <div className="flex items-center justify-between mb-6">
              <h3 
                className="text-xl md:text-2xl font-tech font-bold"
                style={{
                  color: '#e8f4f8',
                  textShadow: '0 0 8px rgba(180, 220, 240, 0.3)'
                }}
              >
                {t('balance.transactions.title')}
              </h3>
            </div>

            {/* Фильтры - горизонтальная строка */}
            <div className="mb-6">
              <div className="flex gap-3 overflow-x-auto pb-2 px-1 filters-scrollbar">
                {/* Date Range Filter */}
                <DateFilter
                  from={dateFilters.from}
                  to={dateFilters.to}
                  onChange={handleDateFilterChange}
                />

                {/* Enum Filters */}
                {availableFilters.map((filter) => (
                  <FilterDropdown
                    key={filter.field}
                    label={filter.localization}
                    options={filter.items}
                    selectedValues={enumFilters[filter.field] || []}
                    onSelectionChange={(values) => handleEnumFilterChange(filter.field, values)}
                  />
                ))}

                {/* Clear Filters Button */}
                <ResetFiltersButton onClick={handleClearFilters} />
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
      </div>
    </div>
  );
};

export const BalanceSkeleton: React.FC = () => (
  <div
    className="fixed inset-0 overflow-y-auto overflow-x-hidden"
    style={{
      background: 'linear-gradient(135deg, #000000 0%, #0a0e1a 50%, #0d1220 100%)',
      boxSizing: 'border-box',
    }}
  >
    {/* Holographic grid background */}
    <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(200, 230, 245, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(200, 230, 245, 0.1) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        transform: 'perspective(500px) rotateX(60deg)',
        transformOrigin: 'center center'
      }}></div>
    </div>

    {/* Glowing orbs */}
    <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-15" style={{
      background: 'rgba(180, 216, 232, 0.8)'
    }}></div>
    <div className="absolute bottom-1/3 right-1/3 w-[40rem] h-[40rem] rounded-full blur-3xl opacity-10" style={{
      background: 'rgba(200, 230, 245, 0.6)'
    }}></div>

    <div className="tab-inner-content relative z-10 min-h-screen pt-16 md:pt-20 px-4 md:px-6 pb-24">
      {/* Header skeleton */}
      <div className="text-center mb-8">
        <div 
          className="h-8 md:h-10 w-48 md:w-64 mx-auto mb-3 rounded-lg animate-pulse"
          style={{
            background: 'rgba(220, 235, 245, 0.1)'
          }}
        ></div>
        <div 
          className="h-4 md:h-5 w-72 md:w-96 mx-auto mb-6 rounded-lg animate-pulse"
          style={{
            background: 'rgba(220, 235, 245, 0.08)'
          }}
        ></div>
        <div
          className="w-24 sm:w-32 md:w-40 h-1 rounded-full mx-auto"
          style={{
            background: 'rgba(180, 220, 240, 0.6)',
            boxShadow: '0 0 8px rgba(180, 220, 240, 0.4)'
          }}
        ></div>
      </div>

      {/* Balance skeleton */}
      <div className="flex justify-center mb-8">
        <div 
          className="relative overflow-hidden rounded-2xl md:rounded-3xl p-6 md:p-8 max-w-md w-full animate-pulse"
          style={{
            background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.85) 0%, rgba(5, 8, 18, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            border: '2px solid rgba(220, 235, 245, 0.2)',
            boxShadow: '0 0 20px rgba(180, 220, 240, 0.15), inset 0 0 20px rgba(200, 230, 245, 0.03)'
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <div className="space-y-2">
              <div 
                className="h-4 w-24 rounded"
                style={{
                  background: 'rgba(220, 235, 245, 0.1)'
                }}
              ></div>
              <div 
                className="h-3 w-16 rounded"
                style={{
                  background: 'rgba(220, 235, 245, 0.08)'
                }}
              ></div>
            </div>
            <div 
              className="w-7 h-7 rounded-lg"
              style={{
                background: 'rgba(220, 235, 245, 0.1)'
              }}
            ></div>
          </div>
          <div className="mb-6">
            <div 
              className="h-12 w-32 rounded mb-2"
              style={{
                background: 'rgba(220, 235, 245, 0.1)'
              }}
            ></div>
            <div 
              className="h-5 w-20 rounded"
              style={{
                background: 'rgba(220, 235, 245, 0.08)'
              }}
            ></div>
          </div>
          <div className="flex gap-3">
            <div 
              className="flex-1 h-12 rounded-xl"
              style={{
                background: 'rgba(220, 235, 245, 0.1)'
              }}
            ></div>
            <div 
              className="flex-1 h-12 rounded-xl"
              style={{
                background: 'rgba(220, 235, 245, 0.1)'
              }}
            ></div>
          </div>
        </div>
      </div>

    </div>
  </div>
);

export default BalanceTab;

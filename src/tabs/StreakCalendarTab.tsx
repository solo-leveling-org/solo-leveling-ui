import React, { useEffect, useState, useMemo, useRef } from 'react';
import { PlayerService } from '../api';
import Icon from '../components/Icon';
import { useLocalization } from '../hooks/useLocalization';
import { useUserAdditionalInfo } from '../contexts/UserAdditionalInfoContext';

const WEEKDAY_LABELS = [0, 1, 2, 3, 4, 5, 6];
const MONTH_KEYS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'] as const;

/**
 * Таб «Активность за месяц» (календарь стрика).
 * Прозрачный фон — орбы видны как на остальных табах.
 */
const StreakCalendarTab: React.FC = () => {
  const { dayStreak } = useUserAdditionalInfo();
  const { t } = useLocalization();
  const now = useMemo(() => new Date(), []);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [activeDays, setActiveDays] = useState<number[]>([]);
  const [openDropdown, setOpenDropdown] = useState<'month' | 'year' | null>(null);
  const dropdownWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (openDropdown === null) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownWrapRef.current && !dropdownWrapRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  useEffect(() => {
    setActiveDays([]);
    PlayerService.getMonthlyActivity(selectedYear, selectedMonth)
      .then((res) => setActiveDays(res.activeDays ?? []))
      .catch(() => setActiveDays([]));
  }, [selectedYear, selectedMonth]);

  const { firstDay, daysInMonth, monthName } = useMemo(() => {
    const d = new Date(selectedYear, selectedMonth - 1, 1);
    const firstDay = d.getDay();
    const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();
    const monthName = t(`common.months.${MONTH_KEYS[selectedMonth - 1]}`);
    return { firstDay, daysInMonth, monthName };
  }, [selectedYear, selectedMonth, t]);

  const calendarCells = useMemo(() => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [firstDay, daysInMonth]);

  const goPrevMonth = () => {
    if (selectedMonth === 1) {
      setSelectedMonth(12);
      setSelectedYear((y) => y - 1);
    } else {
      setSelectedMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (selectedMonth === 12) {
      setSelectedMonth(1);
      setSelectedYear((y) => y + 1);
    } else {
      setSelectedMonth((m) => m + 1);
    }
  };

  const canGoNext = selectedYear < now.getFullYear() || (selectedYear === now.getFullYear() && selectedMonth < now.getMonth() + 1);
  const currentYear = now.getFullYear();
  const years = useMemo(
    () => Array.from({ length: Math.max(0, currentYear - 2025 + 1) }, (_, i) => currentYear - i),
    [currentYear]
  );

  const monthTriggerStyle = {
    background: 'rgba(220, 235, 245, 0.08)',
    color: '#e8f4f8',
    border: '1px solid rgba(220, 235, 245, 0.2)',
    borderRadius: '8px',
    padding: '8px 12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    cursor: 'pointer' as const,
    minWidth: 0,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'flex-start' as const,
    gap: '8px',
  };
  const yearTriggerStyle = {
    background: 'rgba(220, 235, 245, 0.08)',
    color: '#e8f4f8',
    border: '1px solid rgba(220, 235, 245, 0.2)',
    borderRadius: '8px',
    padding: '8px 14px 8px 12px',
    fontSize: '14px',
    fontFamily: 'inherit',
    cursor: 'pointer' as const,
    minWidth: 0,
    display: 'flex' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    gap: '8px',
  };
  const listStyle = {
    background: 'rgba(18, 18, 22, 0.98)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    maxHeight: '220px',
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    position: 'absolute' as const,
    zIndex: 50,
    top: '100%',
    margin: 0,
    marginTop: '4px',
    left: 0,
    right: 0,
    minWidth: 0,
    boxSizing: 'border-box' as const,
    padding: 0,
  };
  const itemStyle = (active: boolean) => ({
    padding: '10px 12px',
    fontSize: '14px',
    color: active ? '#e8f4f8' : 'rgba(220, 235, 245, 0.95)',
    background: active ? 'rgba(220, 235, 245, 0.1)' : 'transparent',
    cursor: 'pointer' as const,
    textAlign: 'left' as const,
    border: 'none',
    width: '100%',
    fontFamily: 'inherit',
  });

  return (
    <div
      className="tab-page-wrapper fixed inset-0 flex flex-col overflow-y-auto overflow-x-hidden"
      style={{ boxSizing: 'border-box', zIndex: 1, background: 'transparent' }}
    >
      <div
        className="p-4 pb-6 space-y-4 flex-1 max-w-lg mx-auto w-full box-border"
        style={{
          paddingTop: 'max(4.5rem, calc(3.5rem + env(safe-area-inset-top, 0px)))',
          paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 0px))',
        }}
      >
        <h2
          className="text-lg font-tech font-semibold text-center"
          style={{ color: '#e8f4f8', textShadow: '0 0 6px rgba(180, 220, 240, 0.2)' }}
        >
          {t('dayStreak.monthlyActivity')}
        </h2>

        {dayStreak && (
          <div
            className="flex items-center justify-center gap-4 py-3 rounded-xl"
            style={{
              background: 'rgba(220, 235, 245, 0.08)',
              border: '1px solid rgba(180, 220, 240, 0.25)',
            }}
          >
            <div className="flex items-center gap-2">
              <Icon type="fire" size={24} active={dayStreak.isExtendedToday} />
              <span style={{ color: 'rgba(220, 235, 245, 0.9)' }} className="text-sm font-tech">
                {t('dayStreak.current')}: <strong style={{ color: '#e8f4f8' }}>{dayStreak.current}</strong>
              </span>
            </div>
            <span style={{ color: 'rgba(220, 235, 245, 0.7)' }} className="text-sm font-tech">
              {t('dayStreak.max')}: <strong style={{ color: '#e8f4f8' }}>{dayStreak.max}</strong>
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={goPrevMonth}
            className="p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(180,220,240,0.5)] shrink-0"
            style={{
              background: 'rgba(220, 235, 245, 0.08)',
              color: '#e8f4f8',
              border: '1px solid rgba(220, 235, 245, 0.15)',
            }}
            aria-label={t('common.prev')}
          >
            <span className="inline-block text-lg font-bold leading-none" style={{ color: 'inherit' }}>‹</span>
          </button>
          <div ref={dropdownWrapRef} className="flex items-center gap-2 flex-1 justify-center min-w-0 max-w-[280px]">
            <div className="relative flex-none p-0 m-0 w-max">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'month' ? null : 'month')}
                style={monthTriggerStyle}
                className="font-tech w-max min-w-0 focus:outline-none focus:ring-2 focus:ring-[rgba(180,220,240,0.5)] focus:ring-offset-1 focus:ring-offset-[rgb(5,8,18)]"
                aria-label={t('dayStreak.monthlyActivity')}
                aria-expanded={openDropdown === 'month'}
              >
                <span className="truncate">{monthName}</span>
                <span className="shrink-0 text-[rgba(220,235,245,0.6)]" style={{ fontSize: '10px' }}>▼</span>
              </button>
              {openDropdown === 'month' && (
                <div style={listStyle} className="font-tech">
                  {MONTH_KEYS.map((key, i) => (
                    <button
                      key={key}
                      type="button"
                      style={itemStyle(selectedMonth === i + 1)}
                      className="first:rounded-t-[7px] last:rounded-b-[7px] hover:bg-[rgba(220,235,245,0.06)] transition-colors"
                      onClick={() => { setSelectedMonth(i + 1); setOpenDropdown(null); }}
                    >
                      {t(`common.months.${key}`)}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative" style={{ width: '80px' }}>
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}
                style={yearTriggerStyle}
                className="font-tech w-full focus:outline-none focus:ring-2 focus:ring-[rgba(180,220,240,0.5)] focus:ring-offset-1 focus:ring-offset-[rgb(5,8,18)]"
                aria-label={t('dayStreak.year')}
                aria-expanded={openDropdown === 'year'}
              >
                <span>{selectedYear}</span>
                <span className="shrink-0 text-[rgba(220,235,245,0.6)]" style={{ fontSize: '10px' }}>▼</span>
              </button>
              {openDropdown === 'year' && (
                <div style={listStyle} className="font-tech">
                  {years.map((y) => (
                    <button
                      key={y}
                      type="button"
                      style={itemStyle(selectedYear === y)}
                      className="first:rounded-t-[7px] last:rounded-b-[7px] hover:bg-[rgba(220,235,245,0.06)] transition-colors"
                      onClick={() => { setSelectedYear(y); setOpenDropdown(null); }}
                    >
                      {y}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={goNextMonth}
            disabled={!canGoNext}
            className="p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(180,220,240,0.5)] disabled:opacity-40 disabled:pointer-events-none shrink-0"
            style={{
              background: 'rgba(220, 235, 245, 0.08)',
              color: '#e8f4f8',
              border: '1px solid rgba(220, 235, 245, 0.15)',
            }}
            aria-label={t('common.next')}
          >
            <span className="inline-block text-lg font-bold leading-none" style={{ color: 'inherit' }}>›</span>
          </button>
        </div>

        <div className="grid grid-cols-7 gap-2 max-w-md mx-auto mb-1">
          {WEEKDAY_LABELS.map((i) => (
            <div
              key={`wd-${i}`}
              className="aspect-square min-h-0 flex items-center justify-center text-[11px] font-tech font-semibold"
              style={{ color: 'rgba(220, 235, 245, 0.45)' }}
            >
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
            </div>
          ))}
        </div>
        <div
          className="grid grid-cols-7 gap-2 max-w-md mx-auto"
          style={{ gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}
        >
          {calendarCells.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="aspect-square min-w-0 min-h-0" aria-hidden />;
            }
            const isActive = activeDays.includes(day);
            const isCurrentDay =
              selectedYear === now.getUTCFullYear() && selectedMonth === now.getUTCMonth() + 1 && day === now.getUTCDate();
            return (
              <div
                key={day}
                className="aspect-square min-w-0 w-full flex items-center justify-center rounded-xl text-sm font-tech font-medium transition-all duration-200"
                style={{
                  background: isActive
                    ? 'rgba(251, 146, 60, 0.35)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: isCurrentDay
                    ? '2px solid rgba(180, 220, 240, 0.6)'
                    : isActive
                      ? '1px solid rgba(251, 146, 60, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.08)',
                  color: isActive ? '#fff' : isCurrentDay ? '#e8f4f8' : 'rgba(220, 235, 245, 0.75)',
                  boxShadow: isActive ? '0 0 12px rgba(251, 146, 60, 0.25)' : 'none',
                }}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default React.memo(StreakCalendarTab);

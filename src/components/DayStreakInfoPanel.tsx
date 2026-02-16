import React, { useEffect, useState, useMemo, useRef } from 'react';
import { PlayerService } from '../api';
import type { DayStreak } from '../api';
import Icon from './Icon';
import { useLocalization } from '../hooks/useLocalization';
import { useUserAdditionalInfo } from '../contexts/UserAdditionalInfoContext';
import { useStreakOverlay } from '../contexts/StreakOverlayContext';

const WEEKDAY_LABELS = [0, 1, 2, 3, 4, 5, 6];
const MONTH_KEYS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'] as const;

/** Панель «Активность за месяц» (календарь стрика). Не полноэкранный overlay — TopBar и BottomBar остаются. */
export function DayStreakInfoPanel() {
  const { dayStreak } = useUserAdditionalInfo();
  const { isOpen, close } = useStreakOverlay();
  if (!isOpen) return null;
  return <DayStreakInfoPanelContent dayStreak={dayStreak} onClose={close} />;
}

interface DayStreakInfoPanelContentProps {
  dayStreak: DayStreak | null;
  onClose: () => void;
}

const DayStreakInfoPanelContent: React.FC<DayStreakInfoPanelContentProps> = ({ dayStreak, onClose }) => {
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
    background: 'rgb(10, 14, 39)',
    border: '1px solid rgba(220, 235, 245, 0.2)',
    borderRadius: '8px',
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
    color: active ? '#fb923c' : 'rgba(220, 235, 245, 0.95)',
    background: active ? 'rgba(251, 146, 60, 0.12)' : 'transparent',
    cursor: 'pointer' as const,
    textAlign: 'left' as const,
    border: 'none',
    width: '100%',
    fontFamily: 'inherit',
  });

  return (
    <div
      className="day-streak-info-panel fixed left-0 right-0 z-40 flex flex-col overflow-y-auto overflow-x-hidden"
      style={{
        bottom: '5rem',
        background: 'linear-gradient(180deg, rgb(5, 8, 18) 0%, rgb(10, 14, 39) 100%)',
        borderTop: '1px solid rgba(220, 235, 245, 0.08)',
      }}
    >
      <div className="p-4 pb-6 space-y-4 flex-1 max-w-lg mx-auto w-full box-border">
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
              background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(234, 88, 12, 0.08) 100%)',
              border: '1px solid rgba(251, 146, 60, 0.3)',
            }}
          >
            <div className="flex items-center gap-2">
              <Icon type="fire" size={24} active={dayStreak.isExtendedToday} />
              <span style={{ color: 'rgba(220, 235, 245, 0.9)' }} className="text-sm font-tech">
                {t('dayStreak.current')}: <strong style={{ color: '#fb923c' }}>{dayStreak.current}</strong>
              </span>
            </div>
            <span style={{ color: 'rgba(220, 235, 245, 0.7)' }} className="text-sm font-tech">
              {t('dayStreak.max')}: <strong style={{ color: '#fb923c' }}>{dayStreak.max}</strong>
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 flex-wrap">
          <button
            type="button"
            onClick={goPrevMonth}
            className="p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(251,146,60,0.5)] shrink-0"
            style={{
              background: 'rgba(220, 235, 245, 0.08)',
              color: '#e8f4f8',
              border: '1px solid rgba(220, 235, 245, 0.15)',
            }}
            aria-label={t('common.prev', 'Пред.')}
          >
            <span className="inline-block text-lg font-bold leading-none" style={{ color: 'inherit' }}>‹</span>
          </button>
          <div ref={dropdownWrapRef} className="flex items-center gap-2 flex-1 justify-center min-w-0 max-w-[280px]">
            <div className="relative flex-none p-0 m-0 w-max">
              <button
                type="button"
                onClick={() => setOpenDropdown(openDropdown === 'month' ? null : 'month')}
                style={monthTriggerStyle}
                className="font-tech w-max min-w-0 focus:outline-none focus:ring-2 focus:ring-[rgba(251,146,60,0.5)] focus:ring-offset-1 focus:ring-offset-[rgb(5,8,18)]"
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
                className="font-tech w-full focus:outline-none focus:ring-2 focus:ring-[rgba(251,146,60,0.5)] focus:ring-offset-1 focus:ring-offset-[rgb(5,8,18)]"
                aria-label={t('dayStreak.year', 'Год')}
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
            className="p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(251,146,60,0.5)] disabled:opacity-40 disabled:pointer-events-none shrink-0"
            style={{
              background: 'rgba(220, 235, 245, 0.08)',
              color: '#e8f4f8',
              border: '1px solid rgba(220, 235, 245, 0.15)',
            }}
            aria-label={t('common.next', 'След.')}
          >
            <span className="inline-block text-lg font-bold leading-none" style={{ color: 'inherit' }}>›</span>
          </button>
        </div>

        <div
          className="grid grid-cols-7 gap-1.5 max-w-md mx-auto"
          style={{
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            gridAutoRows: 'minmax(0, 1fr)',
          }}
        >
          {WEEKDAY_LABELS.map((i) => (
            <div
              key={`wd-${i}`}
              className="aspect-square min-h-0 flex items-center justify-center text-[10px] font-tech"
              style={{ color: 'rgba(220, 235, 245, 0.5)' }}
            >
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
            </div>
          ))}
          {calendarCells.map((day, idx) => {
            if (day === null) {
              return (
                <div
                  key={`empty-${idx}`}
                  className="aspect-square min-w-0 min-h-0 rounded-lg"
                  style={{ background: 'transparent' }}
                  aria-hidden
                />
              );
            }
            const isActive = activeDays.includes(day);
            const isCurrentDay =
              selectedYear === now.getFullYear() && selectedMonth === now.getMonth() + 1 && day === now.getDate();
            return (
              <div
                key={day}
                className="aspect-square min-w-0 min-h-0 w-full flex items-center justify-center rounded-lg text-sm font-tech transition-colors duration-200 box-border"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(251, 146, 60, 0.35) 0%, rgba(234, 88, 12, 0.25) 100%)'
                    : 'rgba(220, 235, 245, 0.06)',
                  border: isCurrentDay
                    ? '2px solid rgba(180, 220, 240, 0.9)'
                    : isActive
                      ? '1px solid rgba(251, 146, 60, 0.5)'
                      : '1px solid rgba(220, 235, 245, 0.1)',
                  color: isActive ? '#fb923c' : 'rgba(220, 235, 245, 0.7)',
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

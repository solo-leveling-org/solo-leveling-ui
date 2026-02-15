import React, { useEffect, useState, useMemo } from 'react';
import { PlayerService } from '../api';
import type { DayStreak } from '../api';
import BaseDialog from './BaseDialog';
import Icon from './Icon';
import { useLocalization } from '../hooks/useLocalization';

const WEEKDAY_LABELS = [0, 1, 2, 3, 4, 5, 6]; // Sun-Sat or Mon-Sun depending on locale

interface MonthlyActivityDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dayStreak: DayStreak | null;
}

const MonthlyActivityDialog: React.FC<MonthlyActivityDialogProps> = ({
  isOpen,
  onClose,
  dayStreak,
}) => {
  const { t } = useLocalization();
  const [activeDays, setActiveDays] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const now = useMemo(() => new Date(), []);
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    PlayerService.getMonthlyActivity(year, month)
      .then((res) => {
        setActiveDays(res.activeDays ?? []);
      })
      .catch(() => setActiveDays([]))
      .finally(() => setLoading(false));
  }, [isOpen, year, month]);

  const { firstDay, daysInMonth, monthName } = useMemo(() => {
    const d = new Date(year, month - 1, 1);
    const firstDay = d.getDay();
    const daysInMonth = new Date(year, month, 0).getDate();
    const key = (['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'] as const)[month - 1];
    const monthName = t(`common.months.${key}`);
    return { firstDay, daysInMonth, monthName };
  }, [year, month, t]);

  const calendarCells = useMemo(() => {
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    return cells;
  }, [firstDay, daysInMonth]);

  return (
    <BaseDialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-sm"
      contentClassName="monthly-activity-dialog"
    >
      <div className="p-4 space-y-4">
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
              <Icon type="fire" size={24} />
              <span style={{ color: 'rgba(220, 235, 245, 0.9)' }} className="text-sm font-tech">
                {t('dayStreak.current')}: <strong style={{ color: '#fb923c' }}>{dayStreak.current}</strong>
              </span>
            </div>
            <span style={{ color: 'rgba(220, 235, 245, 0.7)' }} className="text-sm font-tech">
              {t('dayStreak.max')}: <strong style={{ color: '#fb923c' }}>{dayStreak.max}</strong>
            </span>
          </div>
        )}

        <p className="text-center text-sm font-tech" style={{ color: 'rgba(220, 235, 245, 0.8)' }}>
          {monthName} {year}
        </p>

        {loading ? (
          <p className="text-center text-sm" style={{ color: 'rgba(220, 235, 245, 0.6)' }}>
            {t('common.loading')}
          </p>
        ) : (
          <div
            className="grid grid-cols-7 gap-1"
            style={{ gridTemplateColumns: 'repeat(7, 1fr)' }}
          >
            {WEEKDAY_LABELS.map((i) => (
              <div
                key={i}
                className="text-center text-[10px] font-tech py-1"
                style={{ color: 'rgba(220, 235, 245, 0.5)' }}
              >
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'][i]}
              </div>
            ))}
            {calendarCells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} />;
              }
              const isActive = activeDays.includes(day);
              return (
                <div
                  key={day}
                  className="aspect-square flex items-center justify-center rounded-lg text-sm font-tech"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(251, 146, 60, 0.35) 0%, rgba(234, 88, 12, 0.25) 100%)'
                      : 'rgba(220, 235, 245, 0.06)',
                    border: isActive ? '1px solid rgba(251, 146, 60, 0.5)' : '1px solid transparent',
                    color: isActive ? '#fb923c' : 'rgba(220, 235, 245, 0.7)',
                  }}
                >
                  {day}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </BaseDialog>
  );
};

export default React.memo(MonthlyActivityDialog);

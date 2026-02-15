import React, { useEffect, useState, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useModal } from '../contexts/ModalContext';
import { useUserAdditionalInfo } from '../contexts/UserAdditionalInfoContext';
import { UserService } from '../api';
import { useLocalization } from '../hooks/useLocalization';

const STREAK_NUMBER_DURATION_MS = 1000;

/**
 * Полноэкранный оверлей продления ежедневного стрика.
 * Текст заголовка берётся из notification.message (source=dayStreak), иначе из локали.
 */
const DayStreakOverlay: React.FC = () => {
  const { isDialogOpen } = useModal();
  const { dayStreak: contextStreak, refetch } = useUserAdditionalInfo();
  const { t } = useLocalization();
  const [pending, setPending] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const [overlayMounted, setOverlayMounted] = useState(false);
  const [streakBefore, setStreakBefore] = useState<number>(0);
  const [streakAfter, setStreakAfter] = useState<number>(0);
  const [phase, setPhase] = useState<'before' | 'after'>('before');
  const mountedRef = useRef(true);
  const fireLottieSrc = `${process.env.PUBLIC_URL || ''}/lottie/Fire.lottie`;

  useEffect(() => {
    mountedRef.current = true;
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<{ message?: string | null }>;
      setNotificationMessage(customEvent.detail?.message ?? null);
      setPending(true);
    };
    window.addEventListener('day-streak-notification', handler);
    return () => {
      mountedRef.current = false;
      window.removeEventListener('day-streak-notification', handler);
    };
  }, []);

  useEffect(() => {
    if (!pending || isDialogOpen) return;
    setPending(false);
    const before = contextStreak?.current ?? 0;
    setStreakBefore(before);
    setStreakAfter(before + 1);
    setPhase('before');
    setVisible(true);
    setOverlayMounted(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setOverlayMounted(true));
    });
  }, [pending, isDialogOpen, contextStreak]);

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    (async () => {
      try {
        const info = await UserService.getUserAdditionalInfo();
        if (cancelled || !mountedRef.current) return;
        const newCurrent = info.dayStreak?.current ?? streakBefore + 1;
        setStreakAfter(newCurrent);
        await refetch();
      } catch (e) {
        if (mountedRef.current) setStreakAfter((s) => s);
      }
    })();
    const t1 = setTimeout(() => !cancelled && setPhase('after'), STREAK_NUMBER_DURATION_MS);
    return () => {
      cancelled = true;
      clearTimeout(t1);
    };
  }, [visible, refetch, streakBefore]);

  const handleClose = () => {
    setOverlayMounted(false);
    setTimeout(() => setVisible(false), 320);
  };

  if (!visible) return null;

  return (
    <div
      className="day-streak-overlay fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, rgba(5, 8, 18, 0.97) 0%, rgba(10, 14, 39, 0.98) 100%)',
        backdropFilter: 'blur(16px)',
        opacity: overlayMounted ? 1 : 0,
        transition: 'opacity 0.5s cubic-bezier(0.33, 1, 0.68, 1)',
      }}
    >
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{
          opacity: 0.06,
          backgroundImage: `
            linear-gradient(rgba(200, 230, 245, 0.15) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200, 230, 245, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '28px 28px',
        }}
      />

      <div
        className="relative z-10 flex flex-col items-center gap-6 px-6 transition-transform duration-500"
        style={{
          opacity: overlayMounted ? 1 : 0,
          transform: overlayMounted ? 'translateY(0)' : 'translateY(12px)',
          transition: 'opacity 0.55s cubic-bezier(0.33, 1, 0.68, 1), transform 0.55s cubic-bezier(0.33, 1, 0.68, 1)',
        }}
      >
        <div className="w-40 h-40 flex-shrink-0 opacity-95">
          <DotLottieReact
            src={fireLottieSrc}
            autoplay
            loop
            style={{ width: '100%', height: '100%' }}
          />
        </div>

        <p
          className="text-xl font-tech text-center tracking-wide"
          style={{
            color: 'rgba(232, 244, 248, 0.95)',
            textShadow: '0 0 20px rgba(180, 220, 240, 0.15)',
            letterSpacing: '0.02em',
          }}
        >
          {notificationMessage && notificationMessage.trim() !== ''
            ? notificationMessage
            : t('dayStreak.extended', 'Ежедневный стрик продлён!')}
        </p>

        <div className="flex items-baseline justify-center gap-2 mt-2 min-h-[4.5rem]">
          {phase === 'before' && (
            <span
              className="day-streak-number inline-block text-6xl font-bold tabular-nums leading-none"
              style={{
                color: 'rgba(251, 146, 60, 0.95)',
                textShadow: '0 0 24px rgba(251, 146, 60, 0.25), 0 0 48px rgba(251, 146, 60, 0.12)',
              }}
            >
              {streakBefore}
            </span>
          )}
          {phase === 'after' && (
            <span
              className="day-streak-result inline-block text-6xl font-bold tabular-nums leading-none"
              style={{
                color: 'rgba(251, 146, 60, 0.95)',
                textShadow: '0 0 24px rgba(251, 146, 60, 0.25), 0 0 48px rgba(251, 146, 60, 0.12)',
              }}
            >
              {streakAfter}
            </span>
          )}
          <span
            className="text-2xl font-tech ml-1 leading-none"
            style={{ color: 'rgba(220, 235, 245, 0.8)' }}
          >
            {t('dayStreak.days', 'дней')}
          </span>
        </div>

        <button
          type="button"
          onClick={handleClose}
          className="relative z-10 mt-8 px-8 py-3.5 rounded-2xl font-tech font-medium text-base tracking-wide transition-all duration-300 ease-out"
          style={{
            background: 'rgba(180, 220, 240, 0.12)',
            border: '1px solid rgba(180, 220, 240, 0.25)',
            color: 'rgba(232, 244, 248, 0.95)',
            boxShadow: '0 0 24px rgba(180, 220, 240, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.04)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(180, 220, 240, 0.18)';
            e.currentTarget.style.borderColor = 'rgba(180, 220, 240, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(180, 220, 240, 0.12)';
            e.currentTarget.style.borderColor = 'rgba(180, 220, 240, 0.25)';
          }}
        >
          {t('common.close', 'Закрыть')}
        </button>
      </div>

      <style>{`
        .day-streak-number,
        .day-streak-result {
          animation: dayStreakFadeIn 0.6s cubic-bezier(0.33, 1, 0.68, 1) forwards;
        }
        @keyframes dayStreakFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.97) translateY(6px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default React.memo(DayStreakOverlay);

import React, { useCallback, useEffect, useState, useRef } from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useModal } from '../contexts/ModalContext';
import { useUserAdditionalInfo } from '../contexts/UserAdditionalInfoContext';
import { useFullscreenOverlay } from '../hooks/useFullscreenOverlay';
import { UserService } from '../api';
import { useLocalization } from '../hooks/useLocalization';

const STREAK_NUMBER_DURATION_MS = 1000;

/**
 * Окно в мс, в течение которого даём любому полноэкранному оверлею (TaskCompletionOverlay и др.)
 * время зарегистрироваться в ModalContext (useFullscreenOverlay). Если по истечении этого времени
 * isOverlayOpen всё ещё false — показываем оверлей стрика (сценарии не из завершения задачи).
 * Новые оверлеи, которые должны блокировать показ стрика до своего закрытия, достаточно
 * подключать через useFullscreenOverlay(visible) — менять логику здесь не нужно.
 */
const PENDING_OVERLAY_REGISTRATION_MS = 250;

/**
 * Полноэкранный оверлей продления ежедневного стрика.
 * Показ зависит только от isOverlayOpen (ModalContext): если открыт другой полноэкранный оверлей —
 * показываем стрик только после его закрытия (переход isOverlayOpen true→false).
 * Если оверлея не было (или он не успел зарегистрироваться за PENDING_OVERLAY_REGISTRATION_MS) —
 * показываем после окна регистрации. Так же будет работать с любыми будущими оверлеями на useFullscreenOverlay.
 */
const DayStreakOverlay: React.FC = () => {
  const { isDialogOpen, isOverlayOpen } = useModal();
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
  const prevOverlayOpenRef = useRef(false);
  const fireLottieSrc = `${process.env.PUBLIC_URL || ''}/lottie/Fire.lottie`;

  useFullscreenOverlay(visible);

  // По событию только сохраняем pending, оверлей не показываем (показ — по переходам isOverlayOpen или по окну регистрации)
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

  const showStreakOverlay = useCallback(() => {
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
  }, [contextStreak]);

  // Показ только после закрытия другого полноэкранного оверлея (isOverlayOpen: true → false)
  useEffect(() => {
    const wasOverlayOpen = prevOverlayOpenRef.current;
    prevOverlayOpenRef.current = isOverlayOpen;

    if (wasOverlayOpen && !isOverlayOpen && pending && !isDialogOpen) {
      showStreakOverlay();
    }
  }, [pending, isDialogOpen, isOverlayOpen, showStreakOverlay]);

  // Показ, когда pending и нет открытого оверлея: даём окно на регистрацию любого useFullscreenOverlay, затем показываем
  useEffect(() => {
    if (!pending || isDialogOpen || isOverlayOpen) return;
    const t = setTimeout(() => {
      if (!mountedRef.current) return;
      setPending((p) => {
        if (!p) return p;
        showStreakOverlay();
        return false;
      });
    }, PENDING_OVERLAY_REGISTRATION_MS);
    return () => clearTimeout(t);
  }, [pending, isDialogOpen, isOverlayOpen, showStreakOverlay]);

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
      className="day-streak-overlay fixed left-0 top-0 right-0 bottom-0 z-[100] flex flex-col box-border"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(5, 8, 18, 0.97) 0%, rgba(10, 14, 39, 0.98) 100%)',
        backdropFilter: 'blur(16px)',
        paddingLeft: 'env(safe-area-inset-left, 0)',
        paddingRight: 'env(safe-area-inset-right, 0)',
        paddingTop: 'env(safe-area-inset-top, 0)',
        opacity: overlayMounted ? 1 : 0,
        transition: 'opacity 0.5s cubic-bezier(0.33, 1, 0.68, 1)',
      }}
    >
      {/* Контент по центру (как в TaskCompletionOverlay — контент сверху, кнопка отдельно снизу) */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0 px-6">
        <div
          className="relative z-10 flex flex-col items-center gap-6"
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
              : t('dayStreak.extended')}
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
              {t('dayStreak.days', { count: phase === 'after' ? streakAfter : streakBefore })}
            </span>
          </div>
        </div>
      </div>

      {/* Кнопка «Продолжить» внизу в одном месте с TaskCompletionOverlay */}
      <div
        className="flex-shrink-0 flex justify-center items-center w-full px-4 pt-3 pb-4"
        style={{
          paddingBottom: 'max(1rem, env(safe-area-inset-bottom, 0px))',
          paddingLeft: 'env(safe-area-inset-left, 0)',
          paddingRight: 'env(safe-area-inset-right, 0)',
          background: 'linear-gradient(180deg, transparent 0%, rgba(5, 8, 18, 0.7) 100%)',
          opacity: overlayMounted ? 1 : 0,
          transform: overlayMounted ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.5s cubic-bezier(0.33, 1, 0.68, 1) 0.08s, transform 0.5s cubic-bezier(0.33, 1, 0.68, 1) 0.08s',
        }}
      >
        <button
          type="button"
          onClick={handleClose}
          className="w-full max-w-xs py-3.5 px-6 rounded-xl font-tech font-semibold text-base transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          style={{
            background: 'rgba(180, 220, 240, 0.15)',
            border: '1px solid rgba(180, 220, 240, 0.3)',
            color: 'rgba(232, 244, 248, 0.95)',
            boxShadow: '0 0 20px rgba(180, 220, 240, 0.1)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(180, 220, 240, 0.18)';
            e.currentTarget.style.borderColor = 'rgba(180, 220, 240, 0.35)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(180, 220, 240, 0.15)';
            e.currentTarget.style.borderColor = 'rgba(180, 220, 240, 0.3)';
          }}
        >
          {t('common.continue')}
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

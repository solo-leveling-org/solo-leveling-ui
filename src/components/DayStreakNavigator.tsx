import { useEffect, useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../contexts/ModalContext';

const PENDING_OVERLAY_REGISTRATION_MS = 250;

/**
 * Слушает day-streak-notification и перенаправляет на таб /day-streak.
 * Ждёт закрытия полноэкранных оверлеев (TaskCompletionOverlay и др.) перед переходом.
 */
export function DayStreakNavigator() {
  const navigate = useNavigate();
  const { isDialogOpen, isOverlayOpen } = useModal();
  const [pending, setPending] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const mountedRef = useRef(true);
  const prevOverlayOpenRef = useRef(false);

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

  const navigateToDayStreak = useCallback(() => {
    setPending(false);
    navigate('/day-streak', {
      state: { fromNotification: true, message: notificationMessage },
      replace: false,
    });
  }, [navigate, notificationMessage]);

  // Показ только после закрытия другого полноэкранного оверлея
  useEffect(() => {
    const wasOverlayOpen = prevOverlayOpenRef.current;
    prevOverlayOpenRef.current = isOverlayOpen;

    if (wasOverlayOpen && !isOverlayOpen && pending && !isDialogOpen) {
      navigateToDayStreak();
    }
  }, [pending, isDialogOpen, isOverlayOpen, navigateToDayStreak]);

  // Показ, когда pending и нет открытого оверлея
  useEffect(() => {
    if (!pending || isDialogOpen || isOverlayOpen) return;
    const t = setTimeout(() => {
      if (!mountedRef.current) return;
      setPending((p) => {
        if (!p) return p;
        navigateToDayStreak();
        return false;
      });
    }, PENDING_OVERLAY_REGISTRATION_MS);
    return () => clearTimeout(t);
  }, [pending, isDialogOpen, isOverlayOpen, navigateToDayStreak]);

  return null;
}

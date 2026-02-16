import { useEffect } from 'react';
import { useModal } from '../contexts/ModalContext';

/**
 * Контракт полноэкранного Overlay (для типизации и новых компонентов):
 * компонент считается полноэкранным overlay, если при отображении вызывает useFullscreenOverlay(true).
 */
export type FullscreenOverlayContract = {
  /** Передавайте текущую видимость overlay — пока true, уведомления замирают */
  useFullscreenOverlay(visible: boolean): void;
};

/**
 * Контракт полноэкранного Overlay:
 * - Перекрывает весь экран (включая TopBar и BottomBar).
 * - Пока такой overlay открыт, все Notification (справа сверху) замирают — таймеры не истекают.
 *
 * Использование: в компоненте полноэкранного overlay вызовите этот хук, передав текущее состояние видимости.
 * При добавлении нового полноэкранного overlay достаточно вызвать useFullscreenOverlay(visible).
 *
 * Не используйте для панелей, которые НЕ перекрывают весь экран (например DayStreakInfoPanel
 * оставляет TopBar и BottomBar видимыми — для них этот хук не нужен).
 *
 * @param visible — true, когда overlay отображается на весь экран
 */
export function useFullscreenOverlay(visible: boolean): void {
  const { openOverlay, closeOverlay } = useModal();

  useEffect(() => {
    if (visible) openOverlay();
    return () => closeOverlay();
  }, [visible, openOverlay, closeOverlay]);
}

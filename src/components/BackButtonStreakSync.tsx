import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTelegramWebApp } from '../useTelegram';
import { useStreakOverlay } from '../contexts/StreakOverlayContext';
import { globalBackButtonHandlerRef } from '../App';

/**
 * Синхронизация кнопки "Назад" в Telegram с оверлеем стрика.
 * При открытом оверлее показывает Back и закрывает оверлей по нажатию.
 * При закрытом оверлее на табах кроме collections/leaderboard скрывает Back.
 */
export function BackButtonStreakSync() {
  const location = useLocation();
  const { backButton } = useTelegramWebApp();
  const { isOpen: isStreakOverlayOpen, close: closeStreakOverlay } = useStreakOverlay();
  const isOnMenuTab = location.pathname === '/collections' || location.pathname === '/leaderboard';

  // Закрываем оверлей при смене маршрута (таб/профиль), чтобы не было кадра со старым табом
  useEffect(() => {
    closeStreakOverlay();
  }, [location.pathname, closeStreakOverlay]);

  useEffect(() => {
    if (isStreakOverlayOpen) {
      backButton.show();
      const handleBack = () => {
        closeStreakOverlay();
        if (globalBackButtonHandlerRef.current) {
          backButton.offClick(globalBackButtonHandlerRef.current);
          globalBackButtonHandlerRef.current = null;
        }
      };
      globalBackButtonHandlerRef.current = handleBack;
      backButton.onClick(handleBack);
      return () => {
        if (globalBackButtonHandlerRef.current === handleBack) {
          backButton.offClick(handleBack);
          globalBackButtonHandlerRef.current = null;
        }
      };
    }

    if (!isOnMenuTab) {
      if (globalBackButtonHandlerRef.current) {
        backButton.offClick(globalBackButtonHandlerRef.current);
        globalBackButtonHandlerRef.current = null;
      }
      backButton.hide();
    }
  }, [location.pathname, backButton, isStreakOverlayOpen, closeStreakOverlay, isOnMenuTab]);

  return null;
}

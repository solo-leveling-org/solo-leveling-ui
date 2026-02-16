import React, { createContext, useContext, useState, useCallback } from 'react';

interface StreakOverlayContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const StreakOverlayContext = createContext<StreakOverlayContextValue | null>(null);

/**
 * Контекст оверлея «Активность за месяц» (календарь стрика).
 * Этот оверлей НЕ полноэкранный — остаются TopBar и BottomBar, поэтому он не регистрируется
 * как fullscreen overlay и не останавливает таймеры уведомлений.
 */
export function StreakOverlayProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <StreakOverlayContext.Provider value={{ isOpen, open, close }}>
      {children}
    </StreakOverlayContext.Provider>
  );
}

export function useStreakOverlay() {
  const ctx = useContext(StreakOverlayContext);
  if (!ctx) throw new Error('useStreakOverlay must be used within StreakOverlayProvider');
  return ctx;
}

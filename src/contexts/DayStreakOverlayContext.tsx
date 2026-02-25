import { createContext, useContext, useState, useCallback } from 'react';

interface DayStreakOverlayContextValue {
  isOpen: boolean;
  message: string | null;
  open: (message?: string | null) => void;
  close: () => void;
}

const DayStreakOverlayContext = createContext<DayStreakOverlayContextValue | null>(null);

export function DayStreakOverlayProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const open = useCallback((msg?: string | null) => {
    setMessage(msg ?? null);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    setMessage(null);
  }, []);

  return (
    <DayStreakOverlayContext.Provider value={{ isOpen, message, open, close }}>
      {children}
    </DayStreakOverlayContext.Provider>
  );
}

export function useDayStreakOverlay() {
  const ctx = useContext(DayStreakOverlayContext);
  if (!ctx) {
    throw new Error('useDayStreakOverlay must be used within DayStreakOverlayProvider');
  }
  return ctx;
}

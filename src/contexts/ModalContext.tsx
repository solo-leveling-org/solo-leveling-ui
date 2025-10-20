import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ModalContextType {
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: (isOpen: boolean) => void;
  isBottomBarVisible: boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const isBottomBarVisible = !isBottomSheetOpen;

  const value = {
    isBottomSheetOpen,
    setIsBottomSheetOpen,
    isBottomBarVisible,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

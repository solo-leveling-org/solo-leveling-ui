import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ModalContextType {
  isBottomSheetOpen: boolean;
  setIsBottomSheetOpen: (isOpen: boolean) => void;
  isBottomBarVisible: boolean;
  isDialogOpen: boolean;
  isTaskDialogOpen: boolean; // Флаг для TaskDialog и TaskCompletionDialog
  openDialog: () => void;
  closeDialog: () => void;
  openTaskDialog: () => void; // Открытие TaskDialog или TaskCompletionDialog
  closeTaskDialog: () => void; // Закрытие TaskDialog или TaskCompletionDialog
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
  const [dialogCount, setDialogCount] = useState(0);
  const [taskDialogCount, setTaskDialogCount] = useState(0);

  // Скрываем BottomBar когда открыт BottomSheet (фильтр с выбором значений)
  const isBottomBarVisible = !isBottomSheetOpen;
  const isDialogOpen = dialogCount > 0;
  const isTaskDialogOpen = taskDialogCount > 0;

  const openDialog = useCallback(() => {
    setDialogCount(prev => prev + 1);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogCount(prev => Math.max(0, prev - 1));
  }, []);

  const openTaskDialog = useCallback(() => {
    setTaskDialogCount(prev => prev + 1);
  }, []);

  const closeTaskDialog = useCallback(() => {
    setTaskDialogCount(prev => Math.max(0, prev - 1));
  }, []);

  const value = {
    isBottomSheetOpen,
    setIsBottomSheetOpen,
    isBottomBarVisible,
    isDialogOpen,
    isTaskDialogOpen,
    openDialog,
    closeDialog,
    openTaskDialog,
    closeTaskDialog,
  };

  return (
    <ModalContext.Provider value={value}>
      {children}
    </ModalContext.Provider>
  );
};

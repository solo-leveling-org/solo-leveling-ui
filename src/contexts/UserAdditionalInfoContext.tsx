import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { UserService } from '../api';
import type { DayStreak, UserAdditionalInfoResponse } from '../api';

interface UserAdditionalInfoContextType {
  photoUrl: string | undefined;
  dayStreak: DayStreak | null;
  loading: boolean;
  error: boolean;
  refetch: () => Promise<void>;
}

const UserAdditionalInfoContext = createContext<UserAdditionalInfoContextType | undefined>(undefined);

export const useUserAdditionalInfo = () => {
  const context = useContext(UserAdditionalInfoContext);
  if (context === undefined) {
    throw new Error('useUserAdditionalInfo must be used within UserAdditionalInfoProvider');
  }
  return context;
};

interface UserAdditionalInfoProviderProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

export const UserAdditionalInfoProvider: React.FC<UserAdditionalInfoProviderProps> = ({
  children,
  isAuthenticated,
}) => {
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);
  const [dayStreak, setDayStreak] = useState<DayStreak | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchInfo = useCallback(async () => {
    if (!isAuthenticated) {
      setPhotoUrl(undefined);
      setDayStreak(null);
      return;
    }
    setLoading(true);
    setError(false);
    try {
      const data: UserAdditionalInfoResponse = await UserService.getUserAdditionalInfo();
      setPhotoUrl(data.photoUrl);
      setDayStreak(data.dayStreak ?? null);
    } catch (e) {
      console.error('[UserAdditionalInfo] Failed to fetch:', e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchInfo();
    } else {
      setPhotoUrl(undefined);
      setDayStreak(null);
    }
  }, [isAuthenticated, fetchInfo]);

  const value: UserAdditionalInfoContextType = {
    photoUrl,
    dayStreak,
    loading,
    error,
    refetch: fetchInfo,
  };

  return (
    <UserAdditionalInfoContext.Provider value={value}>
      {children}
    </UserAdditionalInfoContext.Provider>
  );
};

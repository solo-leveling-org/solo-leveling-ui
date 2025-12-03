import React, { useState, useEffect } from 'react';
import { api } from '../services';
import type { User } from '../api';
import ProfileView from './ProfileView';

type UserProfileViewProps = {
  userId: number;
  isAuthenticated: boolean;
};

const UserProfileView: React.FC<UserProfileViewProps> = ({ userId, isAuthenticated }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Загружаем данные пользователя
  useEffect(() => {
    if (isAuthenticated && userId) {
      setLoading(true);
      api.getUserById(userId)
        .then((userData: User) => {
          setUser(userData);
          setLoading(false);
        })
        .catch((error: any) => {
          console.error('Error getting user:', error);
          setLoading(false);
        });
    }
  }, [isAuthenticated, userId]);

  return (
    <ProfileView 
      user={user} 
      loading={loading} 
      isOwnProfile={false}
    />
  );
};

export default UserProfileView;


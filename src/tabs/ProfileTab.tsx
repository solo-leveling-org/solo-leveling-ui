import React, {useState, useEffect} from 'react';
import {api} from '../services';
import type {User} from '../api';
import ProfileView from '../components/ProfileView';

type ProfileTabProps = {
  isAuthenticated: boolean;
};

const ProfileTab: React.FC<ProfileTabProps> = ({isAuthenticated}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // Загружаем данные пользователя только при монтировании компонента и если авторизованы
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      api.getUser()
          .then((userData: User) => {
            setUser(userData);
            setLoading(false);
          })
          .catch((error: any) => {
            console.error('Error getting user:', error);
            setLoading(false);
          });
    }
  }, [isAuthenticated]);

  return (
    <ProfileView 
      user={user} 
      loading={loading} 
      isOwnProfile={true}
    />
  );
};

export default ProfileTab;

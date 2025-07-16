import React from 'react';
import { User } from '../../types';

type ProfileTabProps = {
  user: User;
};

const ProfileTab: React.FC<ProfileTabProps> = ({ user }) => (
  <div className="profile-card">
    <img src={user.photo_url} alt="avatar" className="profile-avatar" />
    <h2>{user.first_name} {user.second_name}</h2>
    <p>@{user.username}</p>
  </div>
);

export default ProfileTab; 
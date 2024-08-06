import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';
import { RootState } from '../store';

const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setError('User ID not found');
        return;
      }
      try {
        const response = await api.get(`/users/${userId}`);
        setProfile(response.data);
        setError(null);
      } catch (error: any) {
        console.error('Failed to fetch user profile:', error);
        setError(error.response?.data?.error || 'Failed to fetch user profile');
      }
    };

    fetchProfile();
  }, [userId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!profile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p>Username: {profile.username}</p>
      <p>Email: {profile.email}</p>
      <p>Role: {profile.role}</p>
    </div>
  );
};

export default UserProfile;

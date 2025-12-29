import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useNavigate } from 'react-router-dom';

export const AppHeader: FC = () => {
  const navigate = useNavigate();

  const isAuth = false;

  const handleConstructorClick = () => {
    navigate('/');
  };

  const handleFeedClick = () => {
    navigate('/feed');
  };

  const handleProfileClick = () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }
    navigate('/profile');
  };

  return (
    <AppHeaderUI
      userName=''
      onConstructorClick={() => navigate('/')}
      onFeedClick={() => navigate('feed')}
      onProfileClick={() => navigate('/profile')}
    />
  );
};

import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch, RootState } from '../../services/store';
import { logoutUser } from '../../services/user/userSlice';
import { useSelector } from '../../services/store';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.user);

  const handleLogout = () => {
    dispatch(logoutUser())
      .unwrap()
      .then(() => {
        navigate('/login', { replace: true });
      })
      .catch((err) => {
        console.error('Ошибка при выходе:', err);
      });
  };
  return (
    <ProfileMenuUI
      handleLogout={handleLogout}
      pathname={pathname}
      userName={user?.name || 'Личный кабинет'}
    />
  );
};

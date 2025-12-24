import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { RootState, useSelector } from '../../../services/store';
import { NavLink } from 'react-router-dom';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({
  onConstructorClick,
  onFeedClick,
  onProfileClick
}) => {
  const userName = useSelector((state: RootState) => state.user.user?.name);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.menu_part_left}>
          <NavLink
            to='/'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
            end
            onClick={onConstructorClick}
          >
            <BurgerIcon type='primary' />
            <p>Конструктор</p>
          </NavLink>

          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.link_active : ''}`
            }
            onClick={onFeedClick}
          >
            <ListIcon type='primary' />
            <p>Лента заказов</p>
          </NavLink>
        </div>

        <div className={styles.logo} onClick={onConstructorClick}>
          <Logo className={styles.logo} />
        </div>

        <NavLink
          to='/profile'
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.link_active : ''} ${styles.link_position_last}`
          }
          onClick={onProfileClick}
        >
          <ProfileIcon type='primary' />
          <p>{userName || 'Личный кабинет'}</p>
        </NavLink>
      </nav>
    </header>
  );
};

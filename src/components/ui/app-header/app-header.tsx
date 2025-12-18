import React, { FC } from 'react';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { RootState } from '../../../services/store';
import { useSelector } from 'react-redux';

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
          <div onClick={onConstructorClick}>
            <BurgerIcon type={'primary'} />
            <p className='text text_type_main-default ml-2 mr-10'>
              Конструктор
            </p>
          </div>
          <div onClick={onFeedClick}>
            <ListIcon type={'primary'} />
            <p className='text text_type_main-default ml-2'>Лента заказов</p>
          </div>
        </div>
        <div className={styles.logo} onClick={onConstructorClick}>
          <Logo className='' />
        </div>

        <div className={styles.link_position_last} onClick={onProfileClick}>
          <ProfileIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>
            {userName || 'Личный кабинет'}
          </p>
        </div>
      </nav>
    </header>
  );
};

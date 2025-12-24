import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import {
  fetchFeed,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
  selectFeedLoading,
  selectFeedError
} from '../../services/feedSlice';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  /** TODO: взять переменные из стора */
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const total = useSelector(selectFeedTotal);
  const totalToday = useSelector(selectFeedTotalToday);
  const loading = useSelector(selectFeedLoading);
  const error = useSelector(selectFeedError);

  const feed = { total, totalToday };
  // Загружаем данные при монтировании компонента
  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  if (loading) {
    return <p className='text text_type_main-medium'>Загрузка данных...</p>;
  }

  if (error) {
    return (
      <p className='text text_type_main-medium' style={{ color: 'red' }}>
        Ошибка: {error}
      </p>
    );
  }

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};

import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { selectFeedOrders } from '../../services/feed/feedSlice';
import { selectIngredientsItems } from '../../services/ingredients/ingredientsSlice';
import { fetchFeed } from '../../services/feed/feedSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector(selectFeedOrders);
  const ingredients = useSelector(selectIngredientsItems);
  const dispatch = useDispatch();

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchFeed());
    }
  }, [dispatch, orders.length]);

  return <ProfileOrdersUI orders={orders} ingredients={ingredients} />;
};
export default ProfileOrders;

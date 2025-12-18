import { ProfileOrdersUI } from '@ui-pages';
import { FC } from 'react';
import { useSelector } from '../../services/store';
import { selectFeedOrders } from '../../services/feedSlice';
import { selectIngredientsItems } from '../../services/ingredientsSlice';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const orders = useSelector(selectFeedOrders);
  const ingredients = useSelector(selectIngredientsItems);

  return <ProfileOrdersUI orders={orders} ingredients={ingredients} />;
};
export default ProfileOrders;

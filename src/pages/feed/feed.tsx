import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { fetchFeed, selectFeedOrders } from '../../services/feedSlice';
import { selectIngredientsItems } from '../../services/ingredientsSlice';
import { FC, useEffect } from 'react';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectFeedOrders);
  const ingredients = useSelector(selectIngredientsItems);

  useEffect(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  if (!orders.length || !ingredients.length) {
    return <Preloader />;
  }

  return (
    <FeedUI
      orders={orders}
      ingredients={ingredients}
      handleGetFeeds={() => dispatch(fetchFeed())}
    />
  );
};

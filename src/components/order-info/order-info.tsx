import { FC, useMemo, useEffect, useState } from 'react';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { selectOrderModalData } from '../../services/constructor/burgerConstructorSlice';
import { selectIngredients } from '../../services/ingredients/ingredientsSlice';
import { useParams } from 'react-router-dom';
import { selectFeedOrders } from '../../services/feed/feedSlice';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const modalOrder = useSelector(selectOrderModalData);
  const feedOrders = useSelector(selectFeedOrders);
  const ingredients: TIngredient[] = useSelector(selectIngredients) ?? [];

  const [serverOrder, setServerOrder] = useState<TOrder | null>(null);
  const [loading, setLoading] = useState(true);

  const orderData =
    modalOrder ??
    feedOrders.find((order) => String(order.number) === number) ??
    serverOrder;

  useEffect(() => {
    if (!orderData && number) {
      setLoading(true);
      getOrderByNumberApi(Number(number))
        .then((res) => {
          if (res.orders && res.orders.length > 0) {
            setServerOrder(res.orders[0]);
          }
        })
        .catch((err) => console.error('Ошибка при получении заказа:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [number, orderData]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (loading || !orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

import { FC, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { selectOrderModalData } from '../../services/burgerConstructorSlice'; // Селекторы из существующих слайсов
import { selectIngredients } from '../../services/ingredientsSlice';
import { useParams } from 'react-router-dom';
import { selectFeedOrders } from '../../services/feedSlice';

export const OrderInfo: FC = () => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams<{ number: string }>();
  const modalOrder = useSelector(selectOrderModalData);
  const feedOrders = useSelector(selectFeedOrders);

  const orderData =
    modalOrder ?? feedOrders.find((order) => String(order.number) === number);

  console.log('Resolved orderData:', orderData);
  const ingredients: TIngredient[] = useSelector(selectIngredients) ?? [];

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };
    // Подсчёт количества каждого ингредиента
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
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

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

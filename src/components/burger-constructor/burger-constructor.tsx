import { FC, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import {
  selectConstructorItems,
  selectOrderRequest,
  selectOrderModalData,
  createOrder,
  closeOrderModal
} from '../../services/burgerConstructorSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const constructorItems = useSelector(selectConstructorItems) ?? {
    bun: null,
    ingredients: []
  };

  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);
  const { user } = useSelector((state) => state.user);

  const onOrderClick = useCallback(() => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login', {
        state: { from: location }
      });
      return;
    }
    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((i) => i._id)
    ];
    dispatch(createOrder({ ingredientIds }));
  }, [constructorItems, orderRequest, dispatch, user, navigate, location]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeOrderModal());
  }, [dispatch]);
  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};

import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import styles from './constructor-page.module.css';
import { BurgerIngredients } from '../../components';
import { BurgerConstructor } from '../../components';
import { Preloader } from '../../components/ui';
import {
  fetchIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} from '../../services/ingredients/ingredientsSlice';

export const ConstructorPage: FC = () => {
  const dispatch = useDispatch();

  // берём состояние загрузки и ошибок из Redux
  const isIngredientsLoading = useSelector(selectIngredientsLoading);
  const ingredientsError = useSelector(selectIngredientsError);

  if (ingredientsError) {
    return <div>Ошибка при загрузке ингредиентов: {ingredientsError}</div>;
  }

  return (
    <>
      {isIngredientsLoading ? (
        <Preloader />
      ) : (
        <main className={styles.containerMain}>
          <h1
            className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}
          >
            Соберите бургер
          </h1>
          <div className={`${styles.main} pl-5 pr-5`}>
            <BurgerIngredients />
            <BurgerConstructor />
          </div>
        </main>
      )}
    </>
  );
};

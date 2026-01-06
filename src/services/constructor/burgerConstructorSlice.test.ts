Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn()
  },
  writable: true
});

import reducer, {
  addToConstructor,
  removeIngredient,
  clearConstructor
} from '../../services/constructor/burgerConstructorSlice';
import { describe, it, expect } from '@jest/globals';

import { TConstructorIngredient } from '@utils-types';

const initialState = {
  constructorItems: {
    bun: null,
    ingredients: [] as TConstructorIngredient[]
  },
  orderRequest: false,
  orderModalData: null,
  error: null
};

const bun: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
};

const main: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0941',
  id: 'main-1',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
};

describe('burgerConstructorSlice reducer', () => {
  it('добавляет ингредиент', () => {
    const state = reducer(initialState, addToConstructor(bun));
    expect(state.constructorItems.bun).toMatchObject({
      _id: bun._id,
      name: bun.name,
      type: bun.type,
      proteins: bun.proteins,
      fat: bun.fat,
      carbohydrates: bun.carbohydrates,
      calories: bun.calories,
      price: bun.price,
      image: bun.image,
      image_mobile: bun.image_mobile,
      image_large: bun.image_large
    });

    const state2 = reducer(state, addToConstructor(main));
    expect(state2.constructorItems.ingredients).toHaveLength(1);
    expect(state2.constructorItems.ingredients[0]).toMatchObject({
      _id: main._id,
      name: main.name,
      type: main.type,
      proteins: main.proteins,
      fat: main.fat,
      carbohydrates: main.carbohydrates,
      calories: main.calories,
      price: main.price,
      image: main.image,
      image_mobile: main.image_mobile,
      image_large: main.image_large
    });
  });

  it('удаляет ингредиент', () => {
    const stateWithIngredient = {
      ...initialState,
      constructorItems: { bun: null, ingredients: [main] }
    };
    const state = reducer(stateWithIngredient, removeIngredient('main-1'));
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('очищает конструктор', () => {
    const stateWithData = {
      ...initialState,
      constructorItems: { bun, ingredients: [main] }
    };
    const state = reducer(stateWithData, clearConstructor());
    expect(state.constructorItems.bun).toBeNull();
    expect(state.constructorItems.ingredients).toHaveLength(0);
  });

  it('меняет порядок ингредиентов', () => {
    const moveIngredients = (
      state: typeof initialState,
      from: number,
      to: number
    ) => {
      const ingredients = [...state.constructorItems.ingredients];
      const [moved] = ingredients.splice(from, 1);
      ingredients.splice(to, 0, moved);
      return {
        ...state,
        constructorItems: { ...state.constructorItems, ingredients }
      };
    };

    const stateWithIngredients = {
      ...initialState,
      constructorItems: { bun: null, ingredients: [main, main] }
    };

    const state = moveIngredients(stateWithIngredients, 0, 1);
    expect(state.constructorItems.ingredients[0]).toMatchObject({
      _id: main._id
    });
    expect(state.constructorItems.ingredients[1]).toMatchObject({
      _id: main._id
    });
  });
});

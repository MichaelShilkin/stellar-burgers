import { describe, it, expect } from '@jest/globals';
import {
  ingredientsReducer as reducer,
  fetchIngredients,
  clearIngredients,
  selectIngredient,
  type IngredientsState
} from '../../services/ingredients/ingredientsSlice';

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null,
  selectedIngredient: null
};

const mockIngredients = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
    __v: 0
  },
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    __v: 0
  }
];

describe('ingredientsSlice reducer', () => {
  it('ставит loading = true при fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('сохраняет ингредиенты и ставит loading = false при fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('сохраняет ошибку и ставит loading = false при fetchIngredients.rejected', () => {
    const errorMsg = 'Ошибка загрузки';
    const action = { type: fetchIngredients.rejected.type, payload: errorMsg };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });

  it('очищает массив ингредиентов при clearIngredients', () => {
    const stateWithItems = { ...initialState, items: mockIngredients };
    const state = reducer(stateWithItems, clearIngredients());
    expect(state.items).toHaveLength(0);
  });

  it('устанавливает выбранный ингредиент при selectIngredient', () => {
    const state = reducer(initialState, selectIngredient(mockIngredients[0]));
    expect(state.selectedIngredient).toEqual(mockIngredients[0]);
  });

  it('сбрасывает выбранный ингредиент при selectIngredient(null)', () => {
    const stateWithSelected = {
      ...initialState,
      selectedIngredient: mockIngredients[0]
    };
    const state = reducer(stateWithSelected, selectIngredient(null));
    expect(state.selectedIngredient).toBeNull();
  });
});

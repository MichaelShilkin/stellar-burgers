import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  nanoid
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { orderBurgerApi } from '../utils/burger-api';
import { RootState } from './rootReducer';

// Тип состояния среза
export type TBurgerConstructorState = {
  constructorItems: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

const savedConstructor = localStorage.getItem('constructorItems');

// Начальное состояние
const initialState: TBurgerConstructorState = {
  constructorItems: savedConstructor
    ? JSON.parse(savedConstructor)
    : { bun: null, ingredients: [] },
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  { ingredientIds: string[] },
  { rejectValue: string }
>(
  'burgerConstructor/createOrder',
  async ({ ingredientIds }, { rejectWithValue }) => {
    try {
      const data = await orderBurgerApi(ingredientIds);
      return data.order;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Ошибка создания заказа');
    }
  }
);
// Slice конструктора
export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addToConstructor: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') state.constructorItems.bun = payload;
        else state.constructorItems.ingredients.push(payload);

        localStorage.setItem(
          'constructorItems',
          JSON.stringify(state.constructorItems)
        );
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() }
      })
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
      localStorage.setItem(
        'constructorItems',
        JSON.stringify(state.constructorItems)
      );
    },
    clearConstructor: (state) => {
      state.constructorItems = { bun: null, ingredients: [] };
      state.orderModalData = null;
      localStorage.removeItem('constructorItems');
    },
    closeOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
        state.constructorItems = { bun: null, ingredients: [] };
        localStorage.removeItem('constructorItems');
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload || 'Ошибка создания заказа';
      });
  }
});

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor.constructorItems;

export const selectOrderRequest = (state: RootState) =>
  state.burgerConstructor.orderRequest;

export const selectOrderModalData = (state: RootState) =>
  state.burgerConstructor.orderModalData;

export const selectConstructorError = (state: RootState) =>
  state.burgerConstructor.error;

export const {
  addToConstructor,
  removeIngredient,
  clearConstructor,
  closeOrderModal
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../utils/burger-api';
import { TIngredient } from '../utils/types';
import { RootState } from '../services/rootReducer';

type IngredientsState = {
  items: TIngredient[];
  loading: boolean;
  error: string | null;
  selectedIngredient: TIngredient | null;
};

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null,
  selectedIngredient: null
};

export const fetchIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: string }
>('ingredients/fetchIngredients', async (_, { rejectWithValue }) => {
  try {
    const data = await getIngredientsApi();
    return data;
  } catch (err: any) {
    return rejectWithValue(err.message || 'Ошибка при получении ингредиентов');
  }
});

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    clearIngredients(state) {
      state.items = [];
    },
    // выбираем один ингредиент для просмотра деталей
    selectIngredient(state, action: PayloadAction<TIngredient | null>) {
      state.selectedIngredient = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<TIngredient[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Ошибка получения данных';
      });
  }
});

export const { clearIngredients, selectIngredient } = ingredientsSlice.actions;
export const ingredientsReducer = ingredientsSlice.reducer;

export const selectIngredients = (state: RootState) => state.ingredients.items;
export const selectIngredientsItems = selectIngredients;
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients.loading;
export const selectIngredientDetails = (state: RootState) =>
  state.ingredients.selectedIngredient;
export const selectIngredientsError = (state: RootState) =>
  state.ingredients.error;

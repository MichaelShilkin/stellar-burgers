import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  getUserApi,
  registerUserApi,
  updateUserApi,
  logoutApi
} from '../utils/burger-api';
import { TUser } from '../utils/types';
import { setCookie } from '../utils/cookie';

// Локальный тип состояния пользователя
interface UserState {
  user: TUser | null;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}
// Начальное состояние слайса
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
  isLoggedIn: false
};

export const loginUser = createAsyncThunk(
  'user/login',
  async ({ email, password }: { email: string; password: string }) => {
    const data = await loginUserApi({ email, password });
    localStorage.setItem('refreshToken', data.refreshToken);
    setCookie('accessToken', data.accessToken);
    return data.user;
  }
);

// Асинхронный thunk для получения данных пользователя
export const fetchUser = createAsyncThunk('user/fetch', async () => {
  const data = await getUserApi();
  return data.user;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      localStorage.removeItem('refreshToken');
    }
  },
  extraReducers: (builder) => {
    // loginUser
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isLoggedIn = true;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Ошибка логина';
    });

    // fetchUser
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isLoggedIn = true;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Ошибка загрузки пользователя';
      state.isLoggedIn = false;
    });
    // registerUser
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isLoggedIn = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Ошибка регистрации';
    });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.error = action.error.message || 'Ошибка при выходе';
    });
  }
});

export const registerUser = createAsyncThunk(
  'user/register',
  async ({
    email,
    password,
    name
  }: {
    email: string;
    password: string;
    name: string;
  }) => {
    const data = await registerUserApi({ email, password, name });

    // сохраняем токены
    localStorage.setItem('refreshToken', data.refreshToken);
    setCookie('accessToken', data.accessToken);

    return data.user;
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (userData: { name: string; email: string; password: string }) => {
    const response = await updateUserApi(userData);
    return response.user;
  }
);
export const logoutUser = createAsyncThunk('user/logout', async () => {
  const data = await logoutApi();
  localStorage.removeItem('refreshToken');
  setCookie('accessToken', '', { expires: -1 });
  return data;
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;

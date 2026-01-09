import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './../services/ingredients/ingredientsSlice';
import feedReducer from './../services/feed/feedSlice';
import burgerConstructorReducer from './constructor/burgerConstructorSlice';
import userReducer from './user/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  burgerConstructor: burgerConstructorReducer,
  user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;

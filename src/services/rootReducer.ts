import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './ingredientsSlice';
import feedReducer from './feedSlice';
import burgerConstructorReducer from '../services/burgerConstructorSlice';
import userReducer from '../services/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  feed: feedReducer,
  burgerConstructor: burgerConstructorReducer,
  user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;

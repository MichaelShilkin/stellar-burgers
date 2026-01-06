import { describe, it, expect, jest } from '@jest/globals';

Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: jest.fn(() => null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
});

import { rootReducer } from './rootReducer';
import { ingredientsReducer } from './ingredients/ingredientsSlice';
import feedReducer from './feed/feedSlice';
import burgerConstructorReducer from './constructor/burgerConstructorSlice';
import userReducer from './user/userSlice';

describe('rootReducer', () => {
  it('возвращает начальное состояние для неизвестного экшена', () => {
    const unknownAction = { type: 'UNKNOWN_ACTION' };

    const state = rootReducer(undefined, unknownAction);

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, unknownAction),
      feed: feedReducer(undefined, unknownAction),
      burgerConstructor: burgerConstructorReducer(undefined, unknownAction),
      user: userReducer(undefined, unknownAction)
    });
  });
});

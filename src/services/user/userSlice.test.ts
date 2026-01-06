import reducer, {
  loginUser,
  fetchUser,
  registerUser,
  logoutUser,
  updateUser,
  logout
} from './userSlice';
import { TUser } from '../../utils/types';
import { describe, it, expect, beforeAll, afterAll, jest } from '@jest/globals';
import * as cookieUtils from '../../utils/cookie';

describe('userSlice', () => {
  const initialState = {
    user: null,
    loading: false,
    error: null,
    isLoggedIn: false
  };

  const mockUser: TUser = {
    name: 'Misha',
    email: 'misha@example.com'
  };

  beforeAll(() => {
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn()
      },
      writable: true
    });

    jest.spyOn(cookieUtils, 'setCookie').mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('should return the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle logout reducer', () => {
    const state = { ...initialState, user: mockUser, isLoggedIn: true };
    expect(reducer(state, logout())).toEqual(initialState);
  });

  it('should handle loginUser.pending', () => {
    const state = reducer(initialState, { type: loginUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle loginUser.fulfilled', () => {
    const state = reducer(initialState, {
      type: loginUser.fulfilled.type,
      payload: mockUser
    });
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isLoggedIn).toBe(true);
  });

  it('should handle loginUser.rejected', () => {
    const state = reducer(initialState, {
      type: loginUser.rejected.type,
      error: { name: 'Error', message: 'Login error' }
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Login error');
  });

  it('should handle fetchUser.pending', () => {
    const state = reducer(initialState, { type: fetchUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle fetchUser.fulfilled', () => {
    const state = reducer(initialState, {
      type: fetchUser.fulfilled.type,
      payload: mockUser
    });
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isLoggedIn).toBe(true);
  });

  it('should handle fetchUser.rejected', () => {
    const state = reducer(initialState, {
      type: fetchUser.rejected.type,
      error: { name: 'Error', message: 'Fetch error' }
    });
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Fetch error');
    expect(state.isLoggedIn).toBe(false);
  });

  it('should handle registerUser.fulfilled', () => {
    const state = reducer(initialState, {
      type: registerUser.fulfilled.type,
      payload: mockUser
    });
    expect(state.loading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isLoggedIn).toBe(true);
  });

  it('should handle logoutUser.fulfilled', () => {
    const stateBefore = { ...initialState, user: mockUser, isLoggedIn: true };
    const state = reducer(stateBefore, { type: logoutUser.fulfilled.type });
    expect(state).toEqual(initialState);
  });

  it('should handle logoutUser.rejected', () => {
    const state = reducer(initialState, {
      type: logoutUser.rejected.type,
      error: { name: 'Error', message: 'Logout error' }
    });
    expect(state.error).toBe('Logout error');
  });

  it('should handle updateUser.pending', () => {
    const state = reducer(initialState, { type: updateUser.pending.type });
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should handle updateUser.fulfilled', () => {
    const updatedUser: TUser = {
      name: 'Updated',
      email: 'updated@example.com'
    };
    const stateBefore = {
      ...initialState,
      user: { name: 'Old', email: 'old@example.com' }
    };
    const state = reducer(stateBefore, {
      type: updateUser.fulfilled.type,
      payload: updatedUser
    });
    expect(state.user).toEqual(updatedUser);
    expect(state.loading).toBe(false);
    expect(state.isLoggedIn).toBe(false);
  });

  it('should handle updateUser.rejected', () => {
    const stateBefore = {
      ...initialState,
      user: { name: 'Old', email: 'old@example.com' }
    };
    const state = reducer(stateBefore, {
      type: updateUser.rejected.type,
      error: { name: 'Error', message: 'Update error' }
    });
    expect(state.error).toBe('Update error');
    expect(state.loading).toBe(false);
  });
});

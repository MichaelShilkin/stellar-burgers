import { describe, it, expect } from '@jest/globals';
import reducer, { fetchFeed } from '../../services/feed/feedSlice';
import type { FeedState } from '../../services/feed/feedSlice';

const mockFeedData = {
  orders: [
    {
      _id: 'order-1',
      ingredients: ['643d69a5c3f7b9001cfa093c', '643d69a5c3f7b9001cfa0941'],
      status: 'done',
      name: 'Заказ 1',
      createdAt: '2026-01-05T15:00:00.000Z',
      updatedAt: '2026-01-05T16:00:00.000Z',
      number: 101
    },
    {
      _id: 'order-2',
      ingredients: ['643d69a5c3f7b9001cfa093c'],
      status: 'pending',
      name: 'Заказ 2',
      createdAt: '2026-01-05T17:00:00.000Z',
      updatedAt: '2026-01-05T18:00:00.000Z',
      number: 102
    }
  ],
  total: 500,
  totalToday: 50
};

const initialState: FeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: null
};

describe('feedSlice reducer', () => {
  it('ставит loading = true при fetchFeed.pending', () => {
    const action = { type: fetchFeed.pending.type };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('сохраняет заказы и ставит loading = false при fetchFeed.fulfilled', () => {
    const action = { type: fetchFeed.fulfilled.type, payload: mockFeedData };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.orders).toEqual(mockFeedData.orders);
    expect(state.total).toBe(mockFeedData.total);
    expect(state.totalToday).toBe(mockFeedData.totalToday);
    expect(state.error).toBeNull();
  });

  it('сохраняет ошибку и ставит loading = false при fetchFeed.rejected', () => {
    const errorMsg = 'Ошибка загрузки ленты';
    const action = { type: fetchFeed.rejected.type, payload: errorMsg };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe(errorMsg);
  });
});

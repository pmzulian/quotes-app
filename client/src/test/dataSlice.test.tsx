import { describe, it, expect } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import dataReducer, { setQuotes, setSelected } from '../slices/dataSlice';

// Setup store for testing
const setupStore = () => {
  return configureStore({
    reducer: {
      data: dataReducer
    }
  });
};

describe('Data Slice', () => {
  it('should handle initial state', () => {
    const store = setupStore();
    const state = store.getState().data;

    expect(state.quotes).toEqual([]);
  });

  it('Should handle setQuotes', () => {
    const store = setupStore();
    const mockQuotes = [
      {
        id: 1,
        description: 'Test quote 1',
        author: 'Test author 1',
        isFavorite: false,
        isVisible: true
      },
      {
        id: 2,
        description: 'Test quote 2',
        author: 'Test author 2',
        isFavorite: true,
        isVisible: true
      }
    ];

    store.dispatch(setQuotes(mockQuotes));

    const state = store.getState().data;
    expect(state.quotes).toEqual(mockQuotes);
    expect(state.quotes).toHaveLength(2);
  });

  it('Should handle setSelected with search term', () => {
    const store = setupStore();
    const mockQuotes = [
      {
        id: 1,
        description: 'JavaScript',
        author: 'John Doe',
        isFavorite: false,
        isVisible: true
      },
      {
        id: 2,
        description: 'React',
        author: 'Jane Smith',
        isFavorite: true,
        isVisible: true
      },
      {
        id: 3,
        description: 'TypeScript',
        author: 'Bob Johnson',
        isFavorite: false,
        isVisible: true
      }
    ];

    store.dispatch(setQuotes(mockQuotes));

    store.dispatch(setSelected('JavaScript'));

    const state = store.getState().data;

    const filteredQuotes = state.quotes.filter(quote =>
      quote.description.toLowerCase().includes('javascript') ||
      quote.author.toLowerCase().includes('javascript')
    );

    expect(filteredQuotes).toHaveLength(1);
    expect(filteredQuotes[0].description).toBe('JavaScript');
  });

  it('Should handle setSelected with empty search term', () => {
    const store = setupStore();
    const mockQuotes = [
      {
        id: 1,
        description: 'Test quote',
        author: 'Test author',
        isFavorite: false,
        isVisible: true
      }
    ];

    store.dispatch(setQuotes(mockQuotes));
    store.dispatch(setSelected(''));

    const state = store.getState().data;
    expect(state.quotes).toEqual(mockQuotes);
  });

  it('Should handle setSelected with case insensitive search', () => {
    const store = setupStore();
    const mockQuotes = [
      {
        id: 1,
        description: 'JavaScript',
        author: 'John Doe',
        isFavorite: false,
        isVisible: true
      }
    ];

    store.dispatch(setQuotes(mockQuotes));
    store.dispatch(setSelected('javascript'));

    const state = store.getState().data;
    const filteredQuotes = state.quotes.filter(quote =>
      quote.description.toLowerCase().includes('javascript') ||
      quote.author.toLowerCase().includes('javascript')
    );

    expect(filteredQuotes).toHaveLength(1);
  });
});

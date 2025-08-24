import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Searcher } from '../components/SearchBar';
import { Provider } from 'react-redux';
import { configureStore, type Dispatch } from '@reduxjs/toolkit';
import dataReducer from '../slices/dataSlice';
import { setSelected } from '../slices/dataSlice';

let lastDebouncedInstance: ReturnType<typeof vi.fn>;

vi.mock('lodash', () => {
  const actual = vi.importActual('lodash');
  return {
    ...actual,
    debounce: vi.fn((fn, delay) => {
      let timer: ReturnType<typeof setTimeout>;
      const debounced = vi.fn((...args: any[]) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
      });
      debounced.cancel = vi.fn(() => clearTimeout(timer));
      lastDebouncedInstance = debounced;
      return debounced;
    }),
  };
});

// Store de Redux mockeado para espiar el dispatch
const setupMockStore = () => {
  const mockDispatch = vi.fn();
  const store = configureStore({
    reducer: { data: dataReducer },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: { extraArgument: {} },
        serializableCheck: false,
        immutableCheck: false,
      }).concat(() => (next: Dispatch) => (action: object) => {
        mockDispatch(action);
        return next(action);
      }),
  });
  return { store, mockDispatch };
};

describe('Searcher Component', () => {
  let store: ReturnType<typeof setupMockStore>['store'];
  let mockDispatch: ReturnType<typeof setupMockStore>['mockDispatch'];
  let debouncedSearchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    const { store: s, mockDispatch: md } = setupMockStore();
    store = s;
    mockDispatch = md;

    render(
      <Provider store={store}>
        <Searcher />
      </Provider>
    );

    debouncedSearchMock = lastDebouncedInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('Should render the search input and buttons', () => {
    expect(screen.getByPlaceholderText('Search Quotes')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '✕' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('Should dispatch setSelected with empty string when Clear button is clicked', () => {
    fireEvent.click(screen.getByRole('button', { name: '✕' }));

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(setSelected(''));
  });

  it('Should dispatch setSelected with input value when Search button is clicked', () => {
    const input = screen.getByPlaceholderText('Search Quotes');
    fireEvent.change(input, { target: { value: 'Test search' } });

    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    vi.advanceTimersByTime(300); // Para que el debounce se complete

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(setSelected('Test search'));
  });

  it('Should debounce input changes and dispatch setSelected after delay', async () => {
    const input = screen.getByPlaceholderText('Search Quotes');

    fireEvent.change(input, { target: { value: 'C' } });
    fireEvent.change(input, { target: { value: 'Ch' } });
    fireEvent.change(input, { target: { value: 'Che' } });

    expect(mockDispatch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(100);
    expect(mockDispatch).not.toHaveBeenCalled();

    vi.advanceTimersByTime(200); // Total 300ms

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(setSelected('Che'));
  });

  it('Should cancel previous debounced calls if input changes again', () => {
    const input = screen.getByPlaceholderText('Search Quotes');

    fireEvent.change(input, { target: { value: 'First' } });
    vi.advanceTimersByTime(100);

    fireEvent.change(input, { target: { value: 'Second' } });
    vi.advanceTimersByTime(100);

    fireEvent.change(input, { target: { value: 'Third' } });
    vi.advanceTimersByTime(300);

    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(setSelected('Third'));
  });
});

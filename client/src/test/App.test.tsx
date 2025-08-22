import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import App from '../App';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureStore } from '@reduxjs/toolkit';
import dataReducer from '../slices/dataSlice';
import type { RootState } from '../store/store';

// Creamos un cliente de query para cada test para asegurar el aislamiento
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Desactivamos los reintentos para que los tests fallen más rápido
    },
  },
});

const setupStore = (preloadedState?: Partial<RootState>) => {
  return configureStore({
    reducer: {
      data: dataReducer,
    },
    preloadedState,
  });
};

const renderAppComponent = (store: ReturnType<typeof setupStore>) => {
  const queryClient = createTestQueryClient();
  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  );
};

describe('App Component', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    vi.stubGlobal('fetch', fetchMock);
  });

  // Limpiamos los mocks después de cada test
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('Should render the main title', () => {
    fetchMock.mockResolvedValue({ ok: true, json: () => Promise.resolve([]) } as Response);
    const store = setupStore();
    renderAppComponent(store);
    expect(screen.getByRole('heading', { name: /quotes/i, level: 1 })).toBeInTheDocument();
  });

  it('Should show the loading message initially', async () => {
    fetchMock.mockImplementation(() => new Promise(() => {})); // Promesa que nunca se resuelve para ver el estado de carga
    const store = setupStore();
    renderAppComponent(store);
    expect(await screen.findByText('Loading quotes...')).toBeInTheDocument();
  });

  it('Should display quotes when the fetch is successful', async () => {
    const mockQuotes = [
      { id: 1, description: 'A successful test quote.', author: 'Vitest' },
    ];
    fetchMock.mockResolvedValue({ ok: true, json: () => Promise.resolve(mockQuotes) } as Response);
    const store = setupStore();
    renderAppComponent(store);
    await waitFor(() => {
      expect(screen.getByText(mockQuotes[0].description)).toBeInTheDocument();
    });
  });

  it('Should display an error message when the fetch fails', async () => {
    fetchMock.mockRejectedValue(new Error('Network error'));
    const store = setupStore();
    renderAppComponent(store);
    expect(await screen.findByText('Error')).toBeInTheDocument();
    expect(screen.getByText(/Failed to load quotes/i)).toBeInTheDocument();
  });
});

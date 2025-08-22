import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NewQuoteForm } from '../components/Form';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import dataReducer from '../slices/dataSlice';
import * as serviceModule from '../service';

vi.mock('../service', () => ({
  addNewQuote: vi.fn(),
}));

const setupStore = () => {
  return configureStore({
    reducer: {
      data: dataReducer,
    },
  });
};

// Helper function to render the component with providers
const renderForm = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const store = setupStore();

  return render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <NewQuoteForm />
      </QueryClientProvider>
    </Provider>
  );
};

describe('NewQuoteForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should render the form elements', () => {
    renderForm();
    expect(screen.getByLabelText('Quote')).toBeInTheDocument();
    expect(screen.getByLabelText('Author')).toBeInTheDocument();
    expect(screen.getByLabelText('Favorite')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Quote' })).toBeInTheDocument();
  });

  it('Should update input values correctly', () => {
    renderForm();
    const descriptionInput = screen.getByLabelText('Quote');
    const authorInput = screen.getByLabelText('Author');
    const favoriteCheckbox = screen.getByLabelText('Favorite');

    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.change(authorInput, { target: { value: 'Test author' } });
    fireEvent.click(favoriteCheckbox);

    expect((descriptionInput as HTMLTextAreaElement).value).toBe('Test description');
    expect((authorInput as HTMLInputElement).value).toBe('Test author');
    expect((favoriteCheckbox as HTMLInputElement).checked).toBe(true);
  });

  it('Should call addNewQuote on form submission with correct data', async () => {
    const addNewQuoteMock = vi.mocked(serviceModule.addNewQuote);
    addNewQuoteMock.mockResolvedValue({});

    renderForm();
    const descriptionInput = screen.getByLabelText('Quote');
    const authorInput = screen.getByLabelText('Author');
    const favoriteCheckbox = screen.getByLabelText('Favorite');
    const submitButton = screen.getByRole('button', { name: 'Add Quote' });

    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.change(authorInput, { target: { value: 'Test author' } });
    fireEvent.click(favoriteCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(addNewQuoteMock).toHaveBeenCalledTimes(1);
      expect(addNewQuoteMock).toHaveBeenCalledWith({
        description: 'Test description',
        author: 'Test author',
        favorite: true,
      });
    });
  });

  it('Should disable the submit button while adding a quote', async () => {
    const addNewQuoteMock = vi.mocked(serviceModule.addNewQuote);
    addNewQuoteMock.mockImplementation(() => new Promise(() => { }));

    renderForm();
    const descriptionInput = screen.getByLabelText('Quote');
    const authorInput = screen.getByLabelText('Author');
    const submitButton = screen.getByRole('button', { name: 'Add Quote' });

    // Rellenar los campos requeridos
    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.change(authorInput, { target: { value: 'Test author' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('Should reset the form after successful submission', async () => {
    const addNewQuoteMock = vi.mocked(serviceModule.addNewQuote);
    addNewQuoteMock.mockResolvedValue({});

    renderForm();
    const descriptionInput = screen.getByLabelText('Quote');
    const authorInput = screen.getByLabelText('Author');
    const favoriteCheckbox = screen.getByLabelText('Favorite');
    const submitButton = screen.getByRole('button', { name: 'Add Quote' });

    fireEvent.change(descriptionInput, { target: { value: 'Test description' } });
    fireEvent.change(authorInput, { target: { value: 'Test author' } });
    fireEvent.click(favoriteCheckbox);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect((descriptionInput as HTMLTextAreaElement).value).toBe('');
      expect((authorInput as HTMLInputElement).value).toBe('');
      expect((favoriteCheckbox as HTMLInputElement).checked).toBe(false);
    });
  });
});

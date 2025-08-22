import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { QuoteCard } from '../components/Card';
import * as serviceModule from '../service';

vi.mock('../service', () => ({
  deleteQuote: vi.fn(),
}));

vi.mock('../components/StarButton', () => ({
  StarButton: () => <button data-testid="star-btn">star</button>,
}));

const renderCard = (props = {}) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <QuoteCard
        id={1}
        description="Test quote"
        author="Test author"
        favorite={false}
        isVisible={true}
        {...props}
      />
    </QueryClientProvider>
  );
};

describe('QuoteCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Should render quote information', () => {
    renderCard();
    expect(screen.getByText('Test quote')).toBeInTheDocument();
    expect(screen.getByText('Test author')).toBeInTheDocument();
    expect(screen.getByTestId('star-btn')).toBeInTheDocument();
    expect(screen.getByText('🗑️')).toBeInTheDocument();
  });

  it('Does not render if isVisible is false', () => {
    renderCard({ isVisible: false });
    expect(screen.queryByText('Test quote')).not.toBeInTheDocument();
  });

  it('Should call deleteQuote when delete is confirmed', async () => {
    const deleteQuoteMock = vi.mocked(serviceModule.deleteQuote);
    deleteQuoteMock.mockResolvedValue({});

    // Mock window.confirm to always return true
    vi.stubGlobal('confirm', () => true);

    renderCard();

    fireEvent.click(screen.getByText('🗑️'));

    await waitFor(() => {
      expect(deleteQuoteMock).toHaveBeenCalledWith(1);
    });

    // Restore window.confirm
    vi.unstubAllGlobals();
  });

  it('Does not call deleteQuote when delete is cancelled', () => {
    const deleteQuoteMock = vi.mocked(serviceModule.deleteQuote);
    vi.stubGlobal('confirm', () => false);

    renderCard();

    fireEvent.click(screen.getByText('🗑️'));

    expect(deleteQuoteMock).not.toHaveBeenCalled();

    vi.unstubAllGlobals();
  });
});

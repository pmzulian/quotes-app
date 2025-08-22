import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QuotesList } from '../components/List';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('../components/Card', () => ({
  QuoteCard: ({ description, author, isVisible }: { description: string, author: string, isVisible: boolean }) => {
    if (!isVisible) return null;
    return (
      <div data-testid="quote-card">
        <p>{description}</p>
        <footer>{author}</footer>
      </div>
    );
  },
}));

const queryClient = new QueryClient();

const renderWithProvider = (quotes: any[]) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <QuotesList quotes={quotes} />
    </QueryClientProvider>
  );
};

describe('QuotesList Component', () => {

  it('Should render a list of quotes correctly', () => {
    const mockQuotes = [
      { id: 1, description: 'First quote', author: 'Author A', isVisible: true },
      { id: 2, description: 'Second quote', author: 'Author B', isVisible: true },
    ];

    renderWithProvider(mockQuotes);

    const renderedCards = screen.getAllByTestId('quote-card');
    expect(renderedCards).toHaveLength(2);

    expect(screen.getByText('First quote')).toBeInTheDocument();
    expect(screen.getByText('Author B')).toBeInTheDocument();
  });

  it('Should render nothing if the quotes array is empty', () => {
    renderWithProvider([]);

    const renderedCards = screen.queryByTestId('quote-card');
    expect(renderedCards).toBeNull();
  });

  it('Should only render visible quotes', () => {
    const mockQuotes = [
      { id: 1, description: 'Visible quote', author: 'Author A', isVisible: true },
      { id: 2, description: 'Invisible quote', author: 'Author B', isVisible: false },
      { id: 3, description: 'Another visible quote', author: 'Author C', isVisible: true },
    ];

    renderWithProvider(mockQuotes);

    const renderedCards = screen.getAllByTestId('quote-card');
    expect(renderedCards).toHaveLength(2);

    expect(screen.queryByText('Invisible quote')).toBeNull();
    expect(screen.getByText('Visible quote')).toBeInTheDocument();
  });

});

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { StarButton } from '../components/StarButton';
import * as serviceModule from '../service';

vi.mock('../service', () => ({
  updateFavorite: vi.fn(),
}));

vi.mock('../assets/fillStar.svg', () => ({ default: 'fillStar.svg' }), { virtual: true });
vi.mock('../assets/emptyStar.svg', () => ({ default: 'emptyStar.svg' }), { virtual: true });

const renderStarButton = (props = {}) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <StarButton id={1} isFavorite={false} {...props} />
    </QueryClientProvider>
  );
};

describe('StarButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Renders the empty star icon when not favorite', () => {
    renderStarButton({ isFavorite: false });
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByRole('img')).toHaveAttribute('src', 'emptyStar.svg');
  });

  it('Renders the filled star icon when favorite', () => {
    renderStarButton({ isFavorite: true });
    expect(screen.getByRole('img')).toHaveAttribute('src', 'fillStar.svg');
  });

  it('Should call updateFavorite with correct arguments on click', async () => {
    const updateFavoriteMock = vi.mocked(serviceModule.updateFavorite);
    renderStarButton({ isFavorite: true, id: 42 });

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(updateFavoriteMock).toHaveBeenCalledWith(42, true);
    });
  });
});

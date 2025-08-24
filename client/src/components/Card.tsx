import { memo } from 'react';
// import { useDispatch } from 'react-redux';
// import { setFavorite } from '../slices/dataSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuote } from '../service';
import { StarButton } from './StarButton';
import './Card.css';

export const QuoteCard: React.FC<QuoteCardProps> = memo(({
  id,
  description,
  author,
  favorite = false,
  isVisible = true
}) => {
  const queryClient = useQueryClient();

  const { mutate: handleDelete } = useMutation({
    mutationFn: () => deleteQuote(id),
    onSuccess: async () => {
      // Fix: Custom toast can be implemented later
      console.log('Quote deleted successfully');
      await queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
    onError: () => {
      // Fix: Custom toast can be implemented later
      console.error('Failed to delete quote');
    },
  });

  const handleDeleteConfirm = () => {
    if (window.confirm('Are you sure you want to delete this quote?')) {
      handleDelete();
    }
  };

  return isVisible && (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">{description}</h3>
        <div className="card-extra">
          <StarButton
            id={id}
            isFavorite={favorite}
          />
          <div className="delete-button" onClick={handleDeleteConfirm}>
            <span className="delete-icon">🗑️</span>
          </div>
        </div>
      </div>
      <div className="card-body">
        <div className="card-meta">
          <span className="card-author">{author}</span>
        </div>
      </div>
    </div>
  );
});

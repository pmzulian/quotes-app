import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addNewQuote } from '../service';
import { useDispatch } from 'react-redux';
import { setQuotes } from '../slices/dataSlice';
import './Form.css';

interface QuoteFormData {
  description: string;
  author: string;
  favorite: boolean;
}

export const NewQuoteForm: React.FC = () => {
  const [formData, setFormData] = useState<QuoteFormData>({
    description: '',
    author: '',
    favorite: false
  });
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: addNewQuote,
    onSuccess: async () => {
      // Fix: Custom toast can be implemented later
      console.log('Quote added successfully');
      // Reset form
      setFormData({
        description: '',
        author: '',
        favorite: false
      });
      // Invalidate and refetch quotes
      await queryClient.invalidateQueries({ queryKey: ['quotes'] });
      const updatedQuotes = await queryClient.fetchQuery<QuoteCardProps[]>({ queryKey: ['quotes'] });
      dispatch(setQuotes(updatedQuotes));
    },
    onError: () => {
      // Fix: Custom toast can be implemented later
      console.error('Failed to add quote');
    },
  });

  const onFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.trim() && formData.author.trim()) {
      mutate(formData);
    }
  };

  const handleInputChange = (field: keyof QuoteFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form
      name="newQuote"
      onSubmit={onFinish}
      className="quote-form"
    >
      <div className="form-item">
        <label htmlFor="description" className="form-label">Quote</label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Enter your quote here"
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          required
          className="form-textarea"
        />
      </div>

      <div className="form-item">
        <label htmlFor="author" className="form-label">Author</label>
        <input
          id="author"
          name="author"
          type="text"
          placeholder="Enter the author's name"
          value={formData.author}
          onChange={(e) => handleInputChange('author', e.target.value)}
          required
          className="form-input"
        />
      </div>

      <div className="form-item">
        <label htmlFor="favorite" className="form-label">Favorite</label>
        <div className="form-switch">
          <input
            id="favorite"
            name="favorite"
            type="checkbox"
            checked={formData.favorite}
            onChange={(e) => handleInputChange('favorite', e.target.checked)}
            className="form-checkbox"
          />
          <span className="switch-label">{formData.favorite ? 'Yes' : 'No'}</span>
        </div>
      </div>

      <div className="form-item">
        <button
          type="submit"
          disabled={isPending}
          className="form-button"
        >
          {isPending ? 'Adding...' : 'Add Quote'}
        </button>
      </div>
    </form>
  );
};

import { useCallback } from 'react';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { setSelected } from '../slices/dataSlice';
import './SearchBar.css';

export const Searcher = () => {
  const dispatch = useDispatch();

  const debouncedSearch = useCallback(
    debounce((searchTerm: string) => {
      dispatch(setSelected(searchTerm));
    }, 300),
    [dispatch]
  );

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const handleClear = () => {
    dispatch(setSelected(''));
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search Quotes"
        onChange={(e) => handleSearch(e.target.value)}
        className="search-input"
      />
      <button 
        type="button" 
        onClick={handleClear}
        className="search-clear"
        title="Clear search"
      >
        ✕
      </button>
      <button 
        type="button" 
        className="search-button"
        onClick={() => {
          const input = document.querySelector('.search-input') as HTMLInputElement;
          if (input) handleSearch(input.value);
        }}
      >
        Search
      </button>
    </div>
  );
};

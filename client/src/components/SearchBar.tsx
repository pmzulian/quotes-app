import { useCallback, useState } from 'react';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { setSelected } from '../slices/dataSlice';
import './SearchBar.css';

export const Searcher = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState(''); // Nuevo estado para el término de búsqueda

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      dispatch(setSelected(value));
    }, 300),
    [dispatch]
  );

  const handleSearch = (value: string) => {
    debouncedSearch(value);
  };

  const handleClear = () => {
    setSearchTerm(''); // Limpiar el estado del input
    dispatch(setSelected(''));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    handleSearch(e.target.value); // Llamar a handleSearch en cada cambio para el debounce
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search Quotes"
        value={searchTerm}
        onChange={handleChange}
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
        onClick={() => handleSearch(searchTerm)}
      >
        Search
      </button>
    </div>
  );
};
import { useCallback } from 'react';
import { debounce } from 'lodash';
import { useDispatch } from 'react-redux';
import { Input } from 'antd';
import { setSelected } from '../slices/dataSlice';

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

  return <Input.Search
    placeholder="Search Quotes"
    allowClear
    enterButton="Search"
    onChange={(e) => handleSearch(e.target.value)}
  />
};

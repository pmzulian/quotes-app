import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { setQuotes } from './slices/dataSlice';
import { fetchQuotes } from './service';
import { Searcher } from './components/SearchBar';
import { QuotesList } from './components/List';
import { NewQuoteForm } from './components/Form';
import './App.css';

function App() {
  const dispatch = useDispatch();

  const [showUpdatingAlert, setShowUpdatingAlert] = useState(false);

  const { data: quotes, error, isLoading, isFetching, isSuccess } = useQuery({
    queryKey: ['quotes'],
    queryFn: () => fetchQuotes(),
  });

  useEffect(() => {
    if (isSuccess && quotes) {
      dispatch(setQuotes(quotes));
    }
  }, [quotes, dispatch, isSuccess]);

  useEffect(() => {
    let timer: number;
    if (isFetching) {
      setShowUpdatingAlert(true);
    } else {
      timer = setTimeout(() => {
        setShowUpdatingAlert(false);
      }, 500);
    }
    return () => {
      clearTimeout(timer);
    };
  }, [isFetching]);


  const storedQuotes = useSelector((state: RootState) => state.data.quotes);

  return (
    <div className="app-layout" style={{ minHeight: '100vh' }}>
      <main className="app-content" style={{
        padding: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <div className="app-space">
          <h1 className="app-title" style={{ textAlign: 'center', margin: 0 }}>Quotes</h1>
          <NewQuoteForm />
          <Searcher />
          <div className="alert-container">
            <div className="alert-wrapper">
              {isLoading && (
                <div className="alert alert-info">
                  <span className="alert-icon">ℹ️</span>
                  <span className="alert-message">Loading quotes...</span>
                </div>
              )}
              {error && (
                <div className="alert alert-error">
                  <span className="alert-icon">❌</span>
                  <div className="alert-content">
                    <span className="alert-message">Error</span>
                    <p className="alert-description">Failed to load quotes. Please try again later.</p>
                  </div>
                </div>
              )}
              {showUpdatingAlert && !isLoading && (
                <div className="alert alert-info">
                  <span className="alert-icon">ℹ️</span>
                  <span className="alert-message">Updating quotes...</span>
                </div>
              )}
              {isSuccess && !isFetching && storedQuotes && storedQuotes.length === 0 && (
                <div className="alert alert-warning">
                  <span className="alert-icon">⚠️</span>
                  <span className="alert-message">No quotes found</span>
                </div>
              )}
            </div>
          </div>
          {storedQuotes && storedQuotes.length > 0 && <QuotesList quotes={storedQuotes} />}
        </div>
      </main>
    </div>
  );
}

export default App;
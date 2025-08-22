import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';
import { setQuotes } from './slices/dataSlice';
import { fetchQuotes } from './service';
import { Searcher } from './components/SearchBar';
import { QuotesList } from './components/List';
import { NewQuoteForm } from './components/Form';
import { Layout, Space, Typography, Alert, Row, Col } from 'antd';
import './App.css';

const { Content } = Layout;
const { Title } = Typography;

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
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{
        padding: '50px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={1} style={{ textAlign: 'center', margin: 0 }}>Quotes</Title>
          <NewQuoteForm />
          <Searcher />
          <Row justify="center">
            <Col span={12} className='alert'>
              {isLoading && (
                <Alert
                  message="Loading quotes..."
                  type="info"
                  showIcon
                />
              )}
              {error && (
                <Alert
                  message="Error"
                  description="Failed to load quotes. Please try again later."
                  type="error"
                  showIcon
                />
              )}
              {showUpdatingAlert && !isLoading && (
                <Alert
                  message="Updating quotes..."
                  type="info"
                  showIcon
                />
              )}
              {isSuccess && !isFetching && storedQuotes && storedQuotes.length === 0 && (
                <Alert
                  message="No quotes found"
                  type="warning"
                  showIcon
                />
              )}
            </Col>
          </Row>
          {storedQuotes && storedQuotes.length > 0 && <QuotesList quotes={storedQuotes} />}
        </Space>
      </Content>
    </Layout>
  );
}

export default App;
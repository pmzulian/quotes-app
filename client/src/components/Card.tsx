// import { useCallback } from 'react';
// import { useDispatch } from 'react-redux';
// import { setFavorite } from '../slices/dataSlice';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteQuote } from '../service';
import { Card, Popconfirm, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import Meta from "antd/es/card/Meta";
import { StarButton } from './StarButton';
import './Card.css';

export const QuoteCard: React.FC<QuoteCardProps> = ({
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
      message.success('Quote deleted successfully');
      // Invalidate and refetch quotes
      await queryClient.invalidateQueries({ queryKey: ['quotes'] });
    },
    onError: () => {
      message.error('Failed to delete quote');
    },
  });

  return isVisible && (
    <Card
      title={description}
      extra={
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <StarButton
            id={id}
            isFavorite={favorite}
          />
          <Popconfirm
            title="Delete Quote"
            description="Are you sure you want to delete this quote?"
            onConfirm={() => handleDelete()}
            okText="Yes"
            cancelText="No"
          >
            <div className="delete-button">
              <DeleteOutlined
                className="delete-icon"
                style={{
                  fontSize: '18px',
                }}
              />
            </div>
          </Popconfirm>
        </div>
      }
      className='Card'
    >
      <Meta
        description={<span style={{ color: '#ffffff' }}>{author}</span>}
        style={{ textAlign: 'center' }}
      />
    </Card>
  );
};

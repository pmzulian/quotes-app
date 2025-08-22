import { Form, Input, Button, Switch, message } from 'antd';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addNewQuote } from '../service';
import { useDispatch } from 'react-redux';
import { setQuotes } from '../slices/dataSlice';

interface QuoteFormData {
  description: string;
  author: string;
  favorite: boolean;
}

export const NewQuoteForm: React.FC = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const { mutate, isPending } = useMutation({
    mutationFn: addNewQuote,
    onSuccess: async () => {
      message.success('Quote added successfully');
      form.resetFields();
      // Invalidate and refetch quotes
      await queryClient.invalidateQueries({ queryKey: ['quotes'] });
      const updatedQuotes = await queryClient.fetchQuery<QuoteCardProps[]>({ queryKey: ['quotes'] });
      dispatch(setQuotes(updatedQuotes));
    },
    onError: () => {
      message.error('Failed to add quote');
    },
  });

  const onFinish = (values: QuoteFormData) => {
    mutate(values);
  };

  return (
    <Form
      form={form}
      name="newQuote"
      onFinish={onFinish}
      layout="vertical"
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <Form.Item
        name="description"
        label="Quote"
        rules={[{ required: true, message: 'Please input your quote' }]}
      >
        <Input.TextArea rows={4} placeholder="Enter your quote here" />
      </Form.Item>

      <Form.Item
        name="author"
        label="Author"
        rules={[{ required: true, message: 'Please input the author' }]}
      >
        <Input placeholder="Enter the author's name" />
      </Form.Item>

      <Form.Item
        name="favorite"
        label="Favorite"
        valuePropName="checked"
        initialValue={false}
      >
        <Switch />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={isPending}>
          Add Quote
        </Button>
      </Form.Item>
    </Form>
  );
};

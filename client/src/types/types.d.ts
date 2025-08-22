interface QuoteCardProps {
  id: number;
  description: string;
  author: string;
  favorite?: boolean;
  isVisible?: boolean;
  created_at?: Date;
  updated_at?: Date;
};

interface QuoteListProps {
  quotes: QuoteCardProps[];
};

// interface QuoteListProps extends Omit<QuoteCardProps, 'isVisible'> {
//   quotes: QuoteCardProps[];
//   visibility?: boolean;
// }

interface RootState {
  data: {
    quotes: QuoteCardProps[];
  };
};

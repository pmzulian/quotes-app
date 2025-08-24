import { memo, useMemo } from 'react';
import { QuoteCard } from "./Card";
import "./List.css";

export const QuotesList: React.FC<QuoteListProps> = memo(({ quotes }) => {
  const memoizedQuotes = useMemo(() =>
    quotes.map((quote) => (
      <QuoteCard
        key={quote.id}
        {...quote}
      />
    ))
    , [quotes]);

  return (
    <div className="quotes-list">
      {memoizedQuotes}
    </div>
  );
});

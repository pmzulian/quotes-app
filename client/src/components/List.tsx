import { QuoteCard } from "./Card";
import "./List.css";

export const QuotesList: React.FC<QuoteListProps> = ({ quotes }) => {

  return (
    <div className="quotes-list">
      {quotes.map((quote) => (
        <QuoteCard
          key={quote.id}
          id={quote.id}
          description={quote.description}
          author={quote.author}
          favorite={quote.favorite}
          isVisible={quote.isVisible}
        />
      ))}
    </div>
  )
}

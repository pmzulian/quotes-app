import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface DataState {
  quotes: QuoteCardProps[]
}

const initialState: DataState = {
  quotes: [],
};

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    setQuotes: (state, action: PayloadAction<QuoteCardProps[]>) => {
      console.log('setQuotes reducer triggered with payload:', action.payload);
      state.quotes = action.payload;
    },
    /* setFavorite: (state, action: PayloadAction<number>) => {
      const currentQuoteIndex = state.quotes.findIndex((quote) => {
        return quote.id === action.payload.quoteId;
      });
      if (currentQuoteIndex >= 0) {
        const isFavorite = state.quotes[currentQuoteIndex].isFavorite;
        state.quotes[currentQuoteIndex].isFavorite = !isFavorite;
      }
    }, */
    setSelected: (state, action: PayloadAction<string>) => {
      const searchTerm = action.payload.toLowerCase();
      state.quotes = state.quotes.map(quote => ({
        ...quote,
        isVisible: quote.description.toLowerCase().includes(searchTerm)
        // quote.author.toLowerCase().includes(searchTerm)
      }));
    }
  },
});

export const { setQuotes, /* setFavorite, */ setSelected } = dataSlice.actions;
// console.log(dataSlice);
export default dataSlice.reducer;

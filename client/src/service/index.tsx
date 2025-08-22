export const fetchQuotes = async () => {
  const response = await fetch('http://localhost:4000/api/listAll');
  if (!response.ok) {
    throw new Error('Failed to fetch quotes');
  }
  return await response.json();
};

export const addNewQuote = async (quoteData: { description: string; author: string; favorite: boolean }) => {
  const response = await fetch('http://localhost:4000/api/addQuote', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(quoteData),
  });

  if (!response.ok) {
    throw new Error('Failed to add quote');
  }

  return await response.json();
};

export const updateFavorite = async (id: number, currentStatus: boolean) => {
  const response = await fetch(`http://localhost:4000/api/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ favorite: !currentStatus })
  });

  if (!response.ok) {
    throw new Error('Failed to update favorite status');
  }

  return await response.json();
};

export const deleteQuote = async (id: number) => {
  const response = await fetch(`http://localhost:4000/api/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete quote');
  }

  return await response.json();
};

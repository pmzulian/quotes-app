import type { Middleware } from 'redux';

export const logger: Middleware = (store) => (next) => (action) => {
  console.log('Dispatching action:', action);
  console.log('Previous state:', store.getState());
  const result = next(action);
  console.log('Next state:', store.getState());
  return result;
};

export const addVisibility = (store) => (next) => (actionInfo) => {
  if (actionInfo.type === 'data/setQuotes') {
    console.log('addVisibility Middleware');
    const newQuotesList = actionInfo.payload.map((quote) => ({
      ...quote,
      visibility: true
    }));
    
    const updatedAction = {
      ...actionInfo,
      payload: newQuotesList
    };
    return next(updatedAction);
  }
  return next(actionInfo);
};

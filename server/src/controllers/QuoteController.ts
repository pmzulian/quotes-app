import { Request, Response } from 'express';
import { QuoteInterface, NewQuoteInterface, UpdateQuoteInterface } from 'types/QuotesTypes';
import { quoteService } from '../models/QuoteService';

const getQuotes = async (req: Request, res: Response) => {
  try {
    const quotes: QuoteInterface[] = await quoteService.getAll();
    res.status(200).json(quotes);
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ error: 'Could not retrieve quotes.' });
  }
};

const addQuote = async (req: Request, res: Response) => {
  if (!req.body.description || !req.body.author) {
    return res.status(400).json({
      error: 'Missing required fields: description and author are required'
    });
  }

  const newQuoteData: NewQuoteInterface = {
    description: req.body.description,
    author: req.body.author,
    favorite: req.body.favorite || false,
  }

  try {
    const createdQuote = await quoteService.create(newQuoteData);
    res.status(201).json(createdQuote);
  } catch (error) {
    console.error('Error creating quote:', error);
    res.status(500).json({ error: 'Could not create quote.' });
  }
};

const updateQuote = async (req: Request, res: Response) => {
  const quoteId = parseInt(req.params.id, 10);
  console.log(`Updating quote with ID: ${quoteId}`);
  const updateData: UpdateQuoteInterface = req.body;

  try {
    const updatedQuote: boolean = await quoteService.update(quoteId, updateData);
    if (!updatedQuote) {
      return res.status(404).json({ error: 'Quote not found.' });
    }
    res.status(200).json(updatedQuote);
  } catch (error) {
    console.error('Error updating quote:', error);
    res.status(500).json({ error: 'Could not update quote.' });
  }
};

const deleteQuote = async (req: Request, res: Response) => {
  const quoteId = parseInt(req.params.id, 10);
  try {
    const deleted: boolean = await quoteService.delete(quoteId);
    if (!deleted) {
      return res.status(404).json({ error: 'Quote not found.' });
    }
    res.status(200).json({ message: 'Quote deleted successfully.' });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ error: 'Could not delete quote.' });
  }
};

export { getQuotes, addQuote, updateQuote, deleteQuote };
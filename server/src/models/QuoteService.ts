import { db } from '../database/knex';
import { QuoteInterface, NewQuoteInterface, UpdateQuoteInterface } from "../types/QuotesTypes";

export class QuoteService {
  private tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * @method _isEmpty
   * @description Private method to check if table is empty.
   * @returns {Promise<boolean>} True if it is empty, false if it is not.
   */
  private async _isEmpty(): Promise<boolean | undefined> {
    try {
      const result = await db(this.tableName).count('id as count').first();
      return Number(result?.count || 0) === 0;
    } catch (error) {
      console.error('Error checking if there are quotes in the table: ', error);
      throw new Error('Could not check.');
    }
  };

  /**
   * @method getAll
   * @description Get all the quotes from the table.
   * @returns {Promise<QuoteInterface[]>} Array of Quotes object.
   */
  async getAll(): Promise<QuoteInterface[]> {
    if (await this._isEmpty()) {
      console.log('Quotes table is empty. Returning empty array for getAll.');
      return [];
    }
    try {
      return await db(this.tableName).select<QuoteInterface[]>();
    } catch (error) {
      console.error('Error fetching all quotes:', error);
      throw new Error('Could not retrieve quotes.');
    }
  };

  /**
   * @method getById
   * @description Get one quote by ID.
   * Not use _isEmpty here because ID searching is specific.
   * @param {number} id - Quote ID.
   * @returns {Promise<QuoteInterface | undefined>}.
   */
  async getById(id: number): Promise<QuoteInterface | undefined> {
    try {
      return await db(this.tableName).where({ id }).first<QuoteInterface>();
    } catch (error) {
      console.error(`Error fetching Quote with ID ${id}:`, error);
      throw new Error('Could not retrieve Quote by ID.');
    }
  };

  /**
   * @method create
   * @description Create a new Quote in the DB.
   * Not use _isEmpty here because it is always implies an insertion.
   * @param {NewQuoteInterface} newQuoteData.
   * @returns {Promise<QuoteInterface>} Quote created, including its ID's and timestamps.
   */
  async create(newQuoteData: NewQuoteInterface): Promise<QuoteInterface> {
    try {
      const [id] = await db(this.tableName)
        .insert<NewQuoteInterface>(newQuoteData) as unknown as number[];
      const createdQuote = await this.getById(id);
      if (!createdQuote) {
        throw new Error('Failed to retrieve the newly created Quote.');
      }
      return createdQuote;
    } catch (error) {
      console.error('Error creating Quote:', error);
      throw new Error('Could not create Quote.');
    }
  };

  /**
   * @method update
   * @description Update Quote by its ID.
   * @param {number} id - ID of the quote to update.
   * @param {UpdateQuoteInterface} updateData - Data to update.
   * @returns {Promise<boolean>} True if quote was updated, false if it was not found.
   */
  async update(id: number, updateData: UpdateQuoteInterface): Promise<boolean> {
    if (await this._isEmpty()) {
      console.log('Quotes table is empty. No record to update.');
      return false;
    }
    try {
      const affectedRows = (await db(this.tableName).where({ id }).update<UpdateQuoteInterface>(updateData)) as number;
      return affectedRows > 0;
    } catch (error) {
      console.error(`Error updating Quote with ID ${id}:`, error);
      throw new Error('Could not update Quote.');
    }
  }

  /**
   * @method delete
   * @description Delete a quote by its ID.
   * @param {number} id - ID of the quote.
   * @returns {Promise<boolean>} True if the Quote was deleted, false if it was not found.
   */
  async delete(id: number): Promise<boolean> {
    if (await this._isEmpty()) {
      console.log('Quotes table is empty. No record to delete.');
      return false;
    }
    try {
      const affectedRows = await db(this.tableName).where({ id }).del();
      return affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting Quote with ID ${id}:`, error);
      throw new Error('Could not delete Quote.');
    }
  }
}

export const quoteService = new QuoteService('quotes');

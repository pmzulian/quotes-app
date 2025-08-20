import knex from 'knex';
import config from '../knexfile';

const environment = process.env.NODE_ENV || 'development';
const knexConfig = config[environment];

export const db = knex(knexConfig);

/**
 * @function createQuotesTable
 * @description Create 'quotes' table if it does not exist.
 */
export async function createQuotesTable(): Promise<void> {
  try {
    const hasTable = await db.schema.hasTable('quotes');
    if (!hasTable) {
      console.log('Creating "quotes" table...');
      await db.schema.createTable('quotes', (table) => {
        // table.string('id', 36).primary() // String UUID
        table.increments('id').primary();
        table.string('description', 255).notNullable();
        table.string('author', 100).notNullable();
        table.boolean('favorite').notNullable().defaultTo(false);
        table.timestamps(true, true);
      });
      console.log('"quotes" table created successfully.');
    } else {
      console.log('"quotes" table already exists.');
    }
  } catch (error) {
    console.error('Error creating "quotes" table:', error);
    process.exit(1);
  }
}

import { db } from './index';

export async function migrate() {
  console.log('Running database migrations...');

  try {
    // Create tables if they don't exist
    await db.run(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        pageNumber INTEGER NOT NULL,
        image TEXT,
        outOfStock BOOLEAN DEFAULT FALSE
      )
    `);

    console.log('Migrations completed successfully');
  } catch (error) {
    console.error('Error running migrations:', error);
    throw error;
  }
}
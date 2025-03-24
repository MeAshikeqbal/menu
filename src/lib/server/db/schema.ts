import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const menuItems = sqliteTable('menu_items', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: real('price').notNull(),
  category: text('category').notNull(),
  image: text('image'),
  pageNumber: integer('page_number').notNull()
});
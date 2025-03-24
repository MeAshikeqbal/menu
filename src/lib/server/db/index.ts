import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { menuItems } from './schema';
import { eq, max } from 'drizzle-orm';

const client = createClient({
  url: process.env.DATABASE_URL || 'file:./local.db'
});

export const db = drizzle(client);

export async function getMenuItems() {
  return await db.select().from(menuItems).orderBy(menuItems.pageNumber);
}

export async function getMenuItemsByPage(pageNumber: number) {
  return await db.select().from(menuItems).where(eq(menuItems.pageNumber, pageNumber));
}

export async function getTotalPages() {
  const result = await db.select({
    maxPage: max(menuItems.pageNumber)
  }).from(menuItems);
  
  return result[0]?.maxPage || 0;
}
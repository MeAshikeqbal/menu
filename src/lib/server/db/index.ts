import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import { menuItems } from './schema';
import { eq, max } from 'drizzle-orm';
import { dev } from '$app/environment';
import { env } from '$env/dynamic/private';

// Create a database client that works in both development and production
const client = createClient({
  url: dev ? 'file:local.db' : env.DATABASE_URL,
  authToken: dev ? undefined : env.DATABASE_AUTH_TOKEN
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
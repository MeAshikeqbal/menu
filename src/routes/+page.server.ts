import type { PageServerLoad } from './$types';
import { getMenuItems, getTotalPages } from '$lib/server/db';

export const load: PageServerLoad = async () => {
  const menuItems = await getMenuItems();
  const totalPages = await getTotalPages();
  
  // Group menu items by page
  const menuItemsByPage = menuItems.reduce((acc, item) => {
    const pageNumber = item.pageNumber;
    if (!acc[pageNumber]) {
      acc[pageNumber] = [];
    }
    acc[pageNumber].push(item);
    return acc;
  }, {} as Record<number, typeof menuItems>);
  
  return {
    menuItemsByPage,
    totalPages
  };
};
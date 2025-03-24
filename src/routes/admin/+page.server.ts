import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db, getMenuItems } from '$lib/server/db';
import { menuItems } from '$lib/server/db/schema';
import { v4 as uuid } from 'uuid';
import { uploadImage } from '$lib/server/db/blob';
import { eq } from 'drizzle-orm';

export const load: PageServerLoad = async () => {
  const items = await getMenuItems();
  
  return {
    menuItems: items
  };
};

export const actions: Actions = {
  add: async ({ request }) => {
    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const priceStr = formData.get('price') as string;
    const category = formData.get('category') as string;
    const pageNumberStr = formData.get('pageNumber') as string;
    const imageFile = formData.get('image') as File | null;
    
    if (!name || !priceStr || !category || !pageNumberStr) {
      return fail(400, { error: 'Missing required fields' });
    }
    
    const price = parseFloat(priceStr);
    const pageNumber = parseInt(pageNumberStr);
    
    if (isNaN(price) || isNaN(pageNumber)) {
      return fail(400, { error: 'Invalid price or page number' });
    }
    
    try {
      // Upload image if provided
      let image = null;
      if (imageFile && imageFile.size > 0) {
        image = await uploadImage(imageFile);
      }
      
      await db.insert(menuItems).values({
        id: uuid(),
        name,
        description,
        price,
        category,
        image,
        pageNumber,
        outOfStock: false
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error adding menu item:', error);
      return fail(500, { error: 'Failed to add menu item' });
    }
  },
  
  delete: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    if (!id) {
      return fail(400, { error: 'Missing item ID' });
    }
    
    try {
      await db.delete(menuItems).where(eq(menuItems.id, id));
      return { success: true };
    } catch (error) {
      console.error('Error deleting menu item:', error);
      return fail(500, { error: 'Failed to delete menu item' });
    }
  },
  
  toggleStock: async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    
    if (!id) {
      return fail(400, { error: 'Missing item ID' });
    }
    
    try {
      // First get the current item to check its status
      const item = await db.select().from(menuItems).where(eq(menuItems.id, id)).limit(1);
      
      if (item.length === 0) {
        return fail(404, { error: 'Item not found' });
      }
      
      // Toggle the outOfStock status
      await db.update(menuItems)
        .set({ outOfStock: !item[0].outOfStock })
        .where(eq(menuItems.id, id));
        
      return { success: true };
    } catch (error) {
      console.error('Error updating menu item stock status:', error);
      return fail(500, { error: 'Failed to update item stock status' });
    }
  }
};
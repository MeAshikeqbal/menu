import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db, getMenuItems } from '$lib/server/db';
import { menuItems } from '$lib/server/db/schema';
import { v4 as uuid } from 'uuid';
import { uploadImage } from '$lib/server/db/blob';

export const load: PageServerLoad = async () => {
  const items = await getMenuItems();
  
  return {
    menuItems: items
  };
};

export const actions: Actions = {
  default: async ({ request }) => {
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
        pageNumber
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error adding menu item:', error);
      return fail(500, { error: 'Failed to add menu item' });
    }
  }
};
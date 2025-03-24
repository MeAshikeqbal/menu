import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

// In a real application, you would use a proper authentication system
// This is just a simple example
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'password123';

export const actions: Actions = {
  default: async ({ request, cookies }) => {
    const formData = await request.formData();
    
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    
    if (!username || !password) {
      return fail(400, { error: 'Username and password are required' });
    }
    
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return fail(401, { error: 'Invalid username or password' });
    }
    
    // Set a simple auth cookie
    cookies.set('auth', 'admin', {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1 day
    });
    
    throw redirect(303, '/admin');
  }
};
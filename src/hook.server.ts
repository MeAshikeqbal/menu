import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Check if the user is trying to access the admin page
  if (event.url.pathname.startsWith('/admin')) {
    const authCookie = event.cookies.get('auth');
    
    // If not authenticated, redirect to login
    if (authCookie !== 'admin') {
      return new Response(null, {
        status: 303,
        headers: {
          Location: '/login'
        }
      });
    }
  }
  
  return resolve(event);
};
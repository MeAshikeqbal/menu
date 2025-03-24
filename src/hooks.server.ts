import { sequence } from '@sveltejs/kit/hooks';
import { validateSession } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

// Protected routes that require authentication
const PROTECTED_ROUTES = [
  '/admin',
];

// Authentication middleware
const authenticationHandler: Handle = async ({ event, resolve }) => {
  // Check if the route is protected
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    event.url.pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    // Validate the session
    const isAuthenticated = validateSession(event.cookies);
    
    if (!isAuthenticated) {
      // Redirect to login page
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/login?redirectTo=${encodeURIComponent(event.url.pathname)}`
        }
      });
    }
  }
  
  // Continue to the route handler
  return resolve(event);
};

// Export the sequence of handlers
export const handle = sequence(authenticationHandler);
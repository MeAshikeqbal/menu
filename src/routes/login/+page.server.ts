import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { 
  validateCredentials, 
  createSession, 
  validateSession,
  createCsrfToken,
  validateCsrfToken
} from '$lib/server/auth';

// Simple in-memory rate limiting
const loginAttempts = new Map<string, { count: number, lastAttempt: number }>();

export const load: PageServerLoad = ({ cookies, url }) => {
  // Check if user is already logged in
  if (validateSession(cookies)) {
    // Redirect to admin or the requested page
    const redirectTo = url.searchParams.get('redirectTo') || '/admin';
    throw redirect(302, redirectTo);
  }
  
  // Generate a CSRF token for the form
  const csrfToken = createCsrfToken(cookies);
  
  return {
    csrf: csrfToken
  };
};

export const actions: Actions = {
  default: async ({ request, cookies, getClientAddress }) => {
    const formData = await request.formData();
    const clientIp = getClientAddress();
    
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const csrfToken = formData.get('csrf') as string;
    const redirectTo = formData.get('redirectTo') as string || '/admin';
    
    // Validate CSRF token
    if (!validateCsrfToken(cookies, csrfToken)) {
      return fail(403, { 
        error: 'Invalid security token',
        message: 'Please refresh the page and try again.'
      });
    }
    
    // Rate limiting
    const now = Date.now();
    const ipAttempts = loginAttempts.get(clientIp) || { count: 0, lastAttempt: 0 };
    
    // Reset attempts if last attempt was more than 15 minutes ago
    if (now - ipAttempts.lastAttempt > 15 * 60 * 1000) {
      ipAttempts.count = 0;
    }
    
    // Check if too many attempts
    if (ipAttempts.count >= 5) {
      return fail(429, { 
        error: 'Too many login attempts',
        message: 'Please try again later.'
      });
    }
    
    // Update attempt counter
    ipAttempts.count++;
    ipAttempts.lastAttempt = now;
    loginAttempts.set(clientIp, ipAttempts);
    
    // Validate inputs
    if (!username || !password) {
      return fail(400, { error: 'Username and password are required' });
    }
    
    // Validate credentials
    const isValid = await validateCredentials(username, password);
    
    if (!isValid) {
      return fail(401, { error: 'Invalid username or password' });
    }
    
    // Clear login attempts on successful login
    loginAttempts.delete(clientIp);
    
    // Create a new session
    createSession(cookies);
    
    // Redirect to the requested page or admin
    throw redirect(303, redirectTo);
  }
};
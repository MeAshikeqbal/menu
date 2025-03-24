import bcrypt from 'bcrypt';
import { dev } from '$app/environment';
import crypto from 'crypto';
import { env } from '$env/dynamic/private';
import type { Cookies } from '@sveltejs/kit';

// Session store (in a real app with multiple users, use a database)
const sessions = new Map<string, { expires: number }>();

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (session.expires < now) {
      sessions.delete(id);
    }
  }
}, 1000 * 60 * 15); // Clean up every 15 minutes

export async function validateCredentials(username: string, password: string): Promise<boolean> {
  // Check if username matches
  if (username !== env.AUTH_USERNAME) {
    return false;
  }
  
  // Verify password against stored hash
  try {
    return await bcrypt.compare(password, env.AUTH_PASSWORD_HASH);
  } catch (error) {
    console.error('Error validating password:', error);
    return false;
  }
}

export function createSession(cookies: Cookies): string {
  // Generate a secure random session ID
  const sessionId = crypto.randomBytes(32).toString('hex');
  
  // Store session with expiration (24 hours)
  const expires = Date.now() + 1000 * 60 * 60 * 24;
  sessions.set(sessionId, { expires });
  
  // Set the session cookie
  cookies.set('session', sessionId, {
    path: '/',
    httpOnly: true,
    secure: !dev,
    sameSite: 'strict',
    maxAge: 60 * 60 * 24, // 1 day in seconds
  });
  
  return sessionId;
}

export function validateSession(cookies: Cookies): boolean {
  const sessionId = cookies.get('session');
  
  if (!sessionId || !sessions.has(sessionId)) {
    return false;
  }
  
  const session = sessions.get(sessionId)!;
  
  // Check if session has expired
  if (session.expires < Date.now()) {
    sessions.delete(sessionId);
    cookies.delete('session', { path: '/' });
    return false;
  }
  
  // Extend session expiration on activity
  session.expires = Date.now() + 1000 * 60 * 60 * 24;
  
  return true;
}

export function destroySession(cookies: Cookies): void {
  const sessionId = cookies.get('session');
  
  if (sessionId) {
    sessions.delete(sessionId);
  }
  
  cookies.delete('session', { path: '/' });
}

// Generate a CSRF token
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// Create a signed CSRF token cookie
export function createCsrfToken(cookies: Cookies): string {
  const csrfToken = generateCsrfToken();
  
  cookies.set('csrf', csrfToken, {
    path: '/',
    httpOnly: true,
    secure: !dev,
    sameSite: 'strict',
    maxAge: 60 * 15, // 15 minutes in seconds
  });
  
  return csrfToken;
}

// Validate CSRF token
export function validateCsrfToken(cookies: Cookies, token: string): boolean {
  const cookieToken = cookies.get('csrf');
  
  if (!cookieToken || !token) {
    return false;
  }
  
  // Use constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(cookieToken),
      Buffer.from(token)
    );
  } catch {
    return false;
  }
}
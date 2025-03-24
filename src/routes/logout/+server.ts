import { redirect } from '@sveltejs/kit';
import { destroySession } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ cookies }) => {
  // Destroy the session
  destroySession(cookies);
  
  // Redirect to the login page
  throw redirect(302, '/login');
};
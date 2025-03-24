import { json } from '@sveltejs/kit';
import { migrate } from '$lib/server/db/migrate';
import { validateSession } from '$lib/server/auth';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
  // Check if user is authenticated
  if (!validateSession(cookies)) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    await migrate();
    return json({ success: true, message: 'Database migrated successfully' });
  } catch (error) {
    console.error('Migration error:', error);
    return json(
      { success: false, message: 'Migration failed', error: String(error) },
      { status: 500 }
    );
  }
};
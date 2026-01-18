import { json } from '@sveltejs/kit';
import { addLight } from '$lib/db.js';
import { logError } from '$lib/errorLogger.js';

export async function POST({ request, locals }) {
  if (!locals.userId) {
    logError('/api/lights/add', 'POST', 401, 'Not authenticated');
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { name } = await request.json();
    
    if (!name || name.trim() === '') {
      logError('/api/lights/add', 'POST', 400, 'Light name is required');
      return json({ error: 'Light name is required' }, { status: 400 });
    }

    const newLight = addLight(locals.userId, name);
    return json({ light: newLight });
  } catch (error) {
    logError('/api/lights/add', 'POST', 500, `Failed to add light: ${error.message}`, error.stack);
    return json({ error: 'Failed to add light' }, { status: 500 });
  }
}


import { json } from '@sveltejs/kit';
import { getUserLights } from '$lib/db.js';
import { logError } from '$lib/errorLogger.js';

export async function GET({ locals }) {
  if (!locals.userId) {
    logError('/api/lights', 'GET', 401, 'Not authenticated');
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const lights = getUserLights(locals.userId);
    return json({ lights });
  } catch (error) {
    logError('/api/lights', 'GET', 500, 'Failed to get lights', error.stack);
    return json({ error: 'Failed to get lights' }, { status: 500 });
  }
}


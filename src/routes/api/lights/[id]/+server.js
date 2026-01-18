import { json } from '@sveltejs/kit';
import { updateLight, deleteLight } from '$lib/db.js';
import { logError } from '$lib/errorLogger.js';

export async function PUT({ locals, params, request }) {
  if (!locals.userId) {
    logError('/api/lights/[id]', 'PUT', 401, 'Not authenticated');
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = params;
  const updates = await request.json();
  
  try {
    updateLight(locals.userId, id, updates);
    return json({ success: true });
  } catch (error) {
    logError('/api/lights/[id]', 'PUT', 500, `Failed to update light ${id}: ${error.message}`, error.stack);
    return json({ error: 'Failed to update light' }, { status: 500 });
  }
}

export async function DELETE({ locals, params }) {
  if (!locals.userId) {
    logError('/api/lights/[id]', 'DELETE', 401, 'Not authenticated');
    return json({ error: 'Not authenticated' }, { status: 401 });
  }

  const { id } = params;
  
  try {
    deleteLight(locals.userId, id);
    return json({ success: true });
  } catch (error) {
    logError('/api/lights/[id]', 'DELETE', 500, `Failed to delete light ${id}: ${error.message}`, error.stack);
    return json({ error: 'Failed to delete light' }, { status: 500 });
  }
}

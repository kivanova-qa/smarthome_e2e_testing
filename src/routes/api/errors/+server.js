import { json } from '@sveltejs/kit';
import { getErrors, clearErrors, getErrorCount } from '$lib/errorLogger.js';

export async function GET({ url }) {
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const clear = url.searchParams.get('clear') === 'true';
  
  if (clear) {
    clearErrors();
  }
  
  const errors = getErrors(limit);
  const count = getErrorCount();
  
  return json({ 
    errors,
    total: count,
    showing: errors.length
  });
}


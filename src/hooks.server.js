export async function handle({ event, resolve }) {
  const session = event.cookies.get('session');
  
  // Initialize locals
  event.locals.userId = null;
  
  if (session) {
    try {
      const sessionData = JSON.parse(session);
      event.locals.userId = sessionData.userId;
    } catch (error) {
      event.cookies.delete('session', { path: '/' });
    }
  }

  const response = await resolve(event);
  return response;
}


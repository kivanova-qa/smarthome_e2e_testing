// Simple in-memory error logger for the mock server

let errors = [];

export function logError(route, method, status, message, stack = null) {
  const error = {
    timestamp: new Date().toISOString(),
    route,
    method,
    status,
    message,
    stack
  };
  
  errors.unshift(error);
  
  // Keep only last 100 errors
  if (errors.length > 100) {
    errors = errors.slice(0, 100);
  }
  
  console.error(`[${new Date().toLocaleString()}] ${method} ${route} - ${status}: ${message}`);
}

export function getErrors(limit = 50) {
  return errors.slice(0, limit);
}

export function clearErrors() {
  errors = [];
}

export function getErrorCount() {
  return errors.length;
}


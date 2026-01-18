import type { ErrorLogEntry } from '../models/errorLog';

export const invalidLoginError: ErrorLogEntry = {
  status: 401,
  endpoint: '/api/auth/login',
  message: 'Invalid password',
};

export const unverifiedLoginError: ErrorLogEntry = {
  status: 401,
  endpoint: '/api/auth/login',
  message: 'User not verified',
};


/*RECCOMEND to implement Error code 409 instead of 400 here
  Duplicate user is a state conflict
  Testing with the current implementation: Error code 400 */
export const duplicateEmailError: ErrorLogEntry = {
  status: 400,
  endpoint: '/api/auth/register',
  message: 'User already exists',
};


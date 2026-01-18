import type { LoginCredentials, RegistrationData } from '../models/auth';
import { currentTimestamp } from '.././utils/helpers';

// Generating unique registration data
export function createRandomRegistrationData(): RegistrationData {
  const random = Math.floor(100000 + Math.random() * 900000);
  const email = `registerNewUser${random}@gmail.com`;
  const password = 'Correct_password123!';

  return {
    email,
    password,
    confirmPassword: password,
  };
}

// Existing verified user for standalone login test
export const verifiedUser: LoginCredentials = {
  email: `valid_email@test.com`,
  password: 'correct_password',
};


// backend/src/modules/auth/login/login.validation.js

import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email').max(64),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

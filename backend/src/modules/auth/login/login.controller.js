// backend/src/modules/auth/login/login.controller.js

import { loginSchema } from './login.validation.js';
import { loginUser } from './login.service.js';

export async function loginController(req, res) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      status: 400,
      message: 'Validation error',
      details: result.error.flatten(),
    });
  }

  const data = await loginUser(result.data);

  return res.status(200).json({
    data,
    message: 'Login successful',
  });
}

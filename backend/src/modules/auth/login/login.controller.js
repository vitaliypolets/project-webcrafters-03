// backend/src/modules/auth/login/login.controller.js

import { loginSchema } from './login.validation.js';
import { loginUser } from './login.service.js';
import { setAuthCookies } from '../shared/authCookies.js';

export async function loginController(req, res) {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      status: 400,
      message: 'Validation error',
      details: result.error.flatten(),
    });
  }

  const resultData = await loginUser(result.data);

  setAuthCookies(res, resultData.refreshToken, resultData.sessionId);

  return res.status(200).json({
    data: {
      user: resultData.user,
      accessToken: resultData.accessToken,
    },
    message: 'Successfully logged in!',
  });
}

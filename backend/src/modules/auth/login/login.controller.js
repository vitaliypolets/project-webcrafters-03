// backend/src/modules/auth/login/login.controller.js

import { loginSchema } from './login.validation.js';
import { loginUser } from './login.service.js';
import { env } from '../../../config/env.js';

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

  const cookieOptions = {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'strict',
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  };

  res.cookie('refreshToken', resultData.refreshToken, cookieOptions);

  res.cookie('sessionId', resultData.sessionId, cookieOptions);

  return res.status(200).json({
    data: {
      user: resultData.user,
      accessToken: resultData.accessToken,
    },
    message: 'Successfully logged in!',
  });
}

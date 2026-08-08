import type { Request, Response } from 'express';
import { env } from '../../../config/env.js';
import { controllerWrapper } from '../../../middlewares/controllerWrapper.js';
import { logoutAuthSession, refreshAuthSession } from './session.service.js';

export const refreshSessionController = controllerWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const refreshToken = req.cookies?.refreshToken;
    const sessionId = req.cookies?.sessionId;

    const session = await refreshAuthSession(refreshToken, sessionId);

    const cookieOptions = {
      httpOnly: true,
      secure: env.nodeEnv === 'production',
      sameSite: 'strict' as const,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    };

    res.cookie('refreshToken', session.refreshToken, cookieOptions);
    res.cookie('sessionId', session.sessionId, cookieOptions);

    res.status(200).json({
      data: {
        accessToken: session.accessToken,
      },
      message: 'Successfully refreshed a session!',
    });
  },
);

export const logoutSessionController = controllerWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const sessionId = req.cookies?.sessionId;

    await logoutAuthSession(sessionId);

    res.clearCookie('refreshToken');
    res.clearCookie('sessionId');
    res.clearCookie('accessToken');

    res.status(204).send();
  },
);

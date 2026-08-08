import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../../../utils/HttpError.js';

export const validateSessionCookies = (req: Request, _res: Response, next: NextFunction): void => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return next(new HttpError(401, 'Refresh token is missing in cookies'));
  }
  next();
};

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';
import { Article } from '../../../models/Article.js';
import { Session } from '../../../models/Session.js';
import { User } from '../../../models/User.js';
import { HttpError } from '../../../utils/HttpError.js';
import { RefreshSessionResult } from './session.types.js';

export const refreshAuthSession = async (
  refreshToken?: string,
  sessionId?: string,
): Promise<RefreshSessionResult> => {
  if (!refreshToken) {
    throw new HttpError(401, 'Refresh token is missing');
  }

  let session = null;

  if (sessionId) {
    session = await Session.findById(sessionId).select('+refreshTokenHash');
  }

  if (!session) {
    throw new HttpError(401, 'Session not found or expired');
  }

  const isTokenValid = await bcrypt.compare(refreshToken, session.refreshTokenHash);
  if (!isTokenValid) {
    await Session.deleteOne({ _id: session._id });
    throw new HttpError(401, 'Invalid refresh token');
  }

  const user = await User.findById(session.userId);
  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  // Видаляємо стару сесію (ротація токенів)
  await Session.deleteOne({ _id: session._id });

  // Генеруємо нові токени
  const newAccessToken = jwt.sign({ userId: user._id, email: user.email }, env.accessTokenSecret, {
    expiresIn: '15m',
  });

  const newRefreshToken = jwt.sign({ userId: user._id }, env.refreshTokenSecret, {
    expiresIn: '30d',
  });

  const refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 днів

  const newSession = await Session.create({
    userId: user._id,
    refreshTokenHash,
    expiresAt,
  });

  // Рахуємо кількість публікацій користувача через модель Article
  const articlesAmount = await Article.countDocuments({ authorId: user._id });

  return {
    user: {
      _id: user._id.toString(),
      name: user.name,
      avatarUrl: user.avatarUrl ?? null,
      articlesAmount,
    },
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionId: newSession._id.toString(),
  };
};

export const logoutAuthSession = async (sessionId?: string): Promise<void> => {
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }
};

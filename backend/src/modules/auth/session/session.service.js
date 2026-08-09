import bcrypt from 'bcrypt';
import { Session } from '../../../models/Session.js';
import { User } from '../../../models/User.js';
import { HttpError } from '../../../utils/HttpError.js';
import { createAccessToken, createRefreshToken } from '../shared/authTokens.js';

export const refreshAuthSession = async (refreshToken, sessionId) => {
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

  await Session.deleteOne({ _id: session._id });

  const newAccessToken = createAccessToken(user);
  const newRefreshToken = createRefreshToken(user);

  const refreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const newSession = await Session.create({
    userId: user._id,
    refreshTokenHash,
    expiresAt,
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    sessionId: newSession._id.toString(),
  };
};

export const logoutAuthSession = async (sessionId) => {
  if (sessionId) {
    await Session.deleteOne({ _id: sessionId });
  }
};

// backend/src/modules/auth/login/login.service.js

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { env } from '../../../config/env.js';
import { Session } from '../../../models/Session.js';
import { User } from '../../../models/User.js';

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select('+passwordHash');

  if (!user) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }

  const userId = user._id.toString();

  const accessToken = jwt.sign({ userId }, env.accessTokenSecret, { expiresIn: '15m' });

  const refreshToken = jwt.sign({ userId }, env.refreshTokenSecret, { expiresIn: '30d' });

  const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

  await Session.create({
    userId: user._id,
    refreshTokenHash,
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return {
    user: {
      id: userId,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
    },
    accessToken,
    refreshToken,
  };
}

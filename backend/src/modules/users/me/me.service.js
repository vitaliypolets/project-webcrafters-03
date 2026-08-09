// TODO (учасник №5): business logic and database access
import createHttpError from 'http-errors';
import { User } from '../../../models/User.js';

export const toPublicUser = (user) => {
  const plain = typeof user.toObject === 'function'
    ? user.toObject()
    : user;

  return {
    _id: plain._id,
    name: plain.name,
    email: plain.email,
    avatarUrl: plain.avatarUrl,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

export const getMe = async (userId) => {
  const user = await User.findById(userId).select('-password');

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return toPublicUser(user);
};

export const updateMe = async (userId, data) => {
  const user = await User.findByIdAndUpdate(
    userId,
    data,
    {
      new: true,
      runValidators: true,
    },
  ).select('-password');

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return toPublicUser(user);
};

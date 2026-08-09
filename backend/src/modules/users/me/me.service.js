// TODO (учасник №5): business logic and database access
import createHttpError from 'http-errors';
import { User } from '../../../models/User.js';
import { validateUpdateUser } from './me.validation.js';

export const getMeService = async userId => {
  const user = await User.findById(userId)
    .select('-password')
    .lean();

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return user;
};

export const updateMeService = async (userId, data) => {
  validateUpdateUser(data);

  const user = await User.findByIdAndUpdate(
    userId,
    data,
    {
      new: true,
      runValidators: true,
    }
  )
    .select('-password')
    .lean();

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  return user;
};

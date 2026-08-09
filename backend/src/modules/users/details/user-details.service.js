// TODO (учасник №7): business logic and database access
import { User } from '../../../models/User.js';
import { HttpError } from '../../../utils/HttpError.js';

export const getUserDetails = async (userId) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  return {
    id: user._id.toString(),
    name: user.name,
    avatar: user.avatarUrl,
    articlesAmount: user.articlesAmount,
  };
};

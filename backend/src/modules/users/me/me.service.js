// TODO (учасник №5): business logic and database access
import { User } from '../../../models/User.js';


export const getUserMe = async (userId) => {
  const user = await User.findById(userId)
    .select('_id name email avatarUrl');

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };
};


export const updateUserMe = async (userId, data) => {
  const allowedFields = [
    'name',
    'avatarUrl',
    'avatarPublicId',
  ];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      updateData[field] = data[field];
    }
  });

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  ).select('_id name email avatarUrl');

  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  };
};

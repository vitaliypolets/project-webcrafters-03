import { User } from '../../../models/User.js';

export const getUsersListService = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || Number(query.perPage) || 6;
  const skip = (page - 1) * limit;
  const sort = query.sort || 'createdAt';

  let sortOption = {
    createdAt: -1,
    _id: -1,
  };

  if (sort === 'popular') {
    sortOption = {
      articlesAmount: -1,
      _id: -1,
    };
  }

  const [users, total] = await Promise.all([
    User.find({}, 'name avatarUrl articlesAmount').sort(sortOption).skip(skip).limit(limit).lean(),
    User.countDocuments(),
  ]);

  const hasNextPage = skip + users.length < total;

  const formattedUsers = users.map((user) => ({
    id: user._id.toString(),
    _id: user._id.toString(),
    name: user.name,
    avatarUrl: user.avatarUrl,
    articlesAmount: user.articlesAmount ?? 0,
  }));

  return {
    data: formattedUsers,
    total,
    page,
    perPage: limit,
    hasNextPage,
  };
};

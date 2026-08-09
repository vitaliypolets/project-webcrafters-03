import { User } from '../../../models/User.js';

export const getUsersListService = async (queryParams) => {
  const { page, perPage, sort, limit } = queryParams;

  const effectiveLimit = limit || perPage;
  const skip = (page - 1) * effectiveLimit;

  let sortOption = { createdAt: -1 };
  if (sort === 'popular') {
    sortOption = { articlesCount: -1 };
  }

  const [users, total] = await Promise.all([
    User.find({}, 'name avatarUrl').sort(sortOption).skip(skip).limit(effectiveLimit).lean(),
    User.countDocuments({}),
  ]);

  const hasNextPage = page * effectiveLimit < total;

  return {
    data: users.map((user) => ({
      _id: user._id.toString(),
      name: user.name,
      avatarUrl: user.avatarUrl ?? undefined,
      articlesCount: 0,
    })),
    total,
    page,
    perPage: effectiveLimit,
    hasNextPage,
  };
};

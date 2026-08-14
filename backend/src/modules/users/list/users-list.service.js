import { User } from '../../../models/User.js';

export const getUsersListService = async (query) => {
  const page = Number(query.page) || 1;
  const perPage = Number(query.perPage) || 6;
  const skip = (page - 1) * perPage;

  const sort = query.sort || 'createdAt';

  const normalizedSort = sort === 'popular' ? 'articlesAmount' : sort;

  let sortOption;

  switch (normalizedSort) {
    case 'articlesAmount':
      sortOption = {
        articlesAmount: -1,
        _id: -1,
      };
      break;

    case 'name':
      sortOption = {
        name: 1,
        _id: 1,
      };
      break;

    case 'createdAt':
    default:
      sortOption = {
        createdAt: -1,
        _id: -1,
      };
      break;
  }

  const [users, total] = await Promise.all([
    User.find({}, 'name avatarUrl articlesAmount')
      .sort(sortOption)
      .skip(skip)
      .limit(perPage)
      .lean(),

    User.countDocuments(),
  ]);

  const hasNextPage = skip + users.length < total;

  const formattedUsers = users.map((user) => ({
    id: user._id.toString(),
    name: user.name,
    avatarUrl: user.avatarUrl ?? null,
    articlesAmount: user.articlesAmount ?? 0,
  }));

  return {
    data: formattedUsers,
    total,
    page,
    perPage,
    hasNextPage,
  };
};

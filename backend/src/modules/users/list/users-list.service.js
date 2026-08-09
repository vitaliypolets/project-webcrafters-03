// TODO (учасник №6): business logic and database access
import { User } from '../../../models/User.js';
import { GetUsersPaginatedResponse } from './users-list.types.js';

interface ParsedQuery {
  page: number;
  perPage: number;
  sort?: 'popular' | 'newest';
  limit?: number;
}

export const getUsersListService = async (
  queryParams: ParsedQuery,
): Promise<GetUsersPaginatedResponse> => {
  const { page, perPage, sort, limit } = queryParams;

  const effectiveLimit = limit || perPage;
  const skip = (page - 1) * effectiveLimit;

  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
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

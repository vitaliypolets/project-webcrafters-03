// TODO (учасник №6): request validation
import { GetUsersQuery } from './users-list.types.js';

export const parseGetUsersQuery = (query: GetUsersQuery) => {
  const page = Math.max(1, Number(query.page) || 1);
  const perPage = Math.min(100, Math.max(1, Number(query.perPage) || 20));
  const limit = query.limit ? Math.min(50, Math.max(1, Number(query.limit))) : undefined;
  const sort = query.sort === 'popular' || query.sort === 'newest' ? query.sort : undefined;

  return {
    page,
    perPage,
    sort,
    limit,
  };
};

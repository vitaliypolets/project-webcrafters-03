export const parseGetUsersQuery = (query) => {
  const page = Math.max(1, Number(query.page) || 1);

  const perPage = Math.min(100, Math.max(1, Number(query.perPage) || 20));

  const allowedSortValues = ['articlesAmount', 'createdAt', 'name', 'popular'];

  const sort = allowedSortValues.includes(query.sort) ? query.sort : undefined;

  return {
    page,
    perPage,
    sort,
  };
};

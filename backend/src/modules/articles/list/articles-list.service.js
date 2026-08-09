// TODO (учасник №11): business logic and database access
import { Article } from '../../../models/Article.js';

export const getArticlesListService = async (query) => {
  const page = query.page;
  const perPage = query.limit || query.perPage;
  const skip = (page - 1) * perPage;

  const filter = {};

  if (query.authorId) {
    filter.authorId = query.authorId;
  }

  if (query.excludeId) {
    filter._id = { $ne: query.excludeId };
  }

  const sort =
    query.filter === 'popular'
      ? { viewsCount: -1, publicationDate: -1 }
      : { publicationDate: -1 };

  const [totalItems, articles] = await Promise.all([
    Article.countDocuments(filter),
    Article.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(perPage),
  ]);

  const totalPages = Math.ceil(totalItems / perPage) || 1;
  const hasNextPage = page < totalPages;

  return {
    articles,
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage,
  };
};

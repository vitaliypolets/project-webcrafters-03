// TODO (учасник №11): business logic and database access
import { Article } from '../../../models/Article.js';

export const getArticlesListService = async (query) => {
  const page = Math.max(1, Number(query.page) || 1);
  const perPage = Math.max(1, Number(query.limit || query.perPage) || 8);
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

  const [totalItems, rawArticles] = await Promise.all([
    Article.countDocuments(filter),
    Article.find(filter)
      .populate('authorId', '_id name avatar')
      .sort(sort)
      .skip(skip)
      .limit(perPage)
      .lean(),
  ]);

  const articles = rawArticles.map((article) => {
    const { _id, authorId, ...rest } = article;

    return {
      ...rest,
      id: _id.toString(),
      author:
        typeof authorId === 'object' && authorId !== null
          ? {
              id: authorId._id.toString(),
              name: authorId.name || 'Unknown Author',
              avatar: authorId.avatar || null,
            }
          : {
              id: authorId ? String(authorId) : '',
              name: 'Unknown Author',
              avatar: null,
            },
    };
  });

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

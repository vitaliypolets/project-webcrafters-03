import { Article } from '../../../models/Article.js';
import { User } from '../../../models/User.js';
import { HttpError } from '../../../utils/HttpError.js';

const toArticleDto = (article) => ({
  id: article._id.toString(),
  title: article.title,
  description: article.description,
  imageUrl: article.imageUrl,
  publicationDate: article.publicationDate,
  authorId: article.authorId.toString(),
  authorName: article.authorName,
  viewsCount: article.viewsCount,
  category: article.category,
  isBookmarked: true,
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
});

export const getBookmarks = async (userId, { page, perPage }) => {
  const user = await User.findById(userId).select('savedArticles').lean();

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const savedIds = [...user.savedArticles].reverse();
  const totalItems = savedIds.length;
  const totalPages = Math.ceil(totalItems / perPage);
  const skip = (page - 1) * perPage;
  const pageIds = savedIds.slice(skip, skip + perPage);

  const articles = pageIds.length
    ? await Article.find({ _id: { $in: pageIds } }).lean()
    : [];

  const articleById = new Map(
    articles.map((article) => [article._id.toString(), article]),
  );

  const orderedArticles = pageIds
    .map((id) => articleById.get(id.toString()))
    .filter(Boolean)
    .map(toArticleDto);

  return {
    data: orderedArticles,
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
  };
};

export const addBookmark = async (userId, articleId) => {
  const article = await Article.findById(articleId).lean();

  if (!article) {
    throw new HttpError(404, 'Article not found');
  }

  const user = await User.findById(userId).select('savedArticles');

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const alreadySaved = user.savedArticles.some(
    (savedId) => savedId.toString() === articleId,
  );

  if (alreadySaved) {
    throw new HttpError(409, 'Article is already bookmarked');
  }

  user.savedArticles.push(article._id);
  await user.save();

  return toArticleDto(article);
};

export const removeBookmark = async (userId, articleId) => {
  const user = await User.findById(userId).select('savedArticles');

  if (!user) {
    throw new HttpError(404, 'User not found');
  }

  const bookmarkExists = user.savedArticles.some(
    (savedId) => savedId.toString() === articleId,
  );

  if (!bookmarkExists) {
    throw new HttpError(404, 'Bookmark not found');
  }

  user.savedArticles.pull(articleId);
  await user.save();

  return { articleId };
};

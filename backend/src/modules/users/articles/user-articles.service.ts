import { Types } from 'mongoose';
import { Article } from '../../../models/Article.js';
import { User } from '../../../models/User.js';
import { HttpError } from '../../../utils/HttpError.js';
import type { PaginatedUserArticles, UserArticlesQuery } from './user-articles.types.js';

interface LeanArticle {
  _id: Types.ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  publicationDate: Date;
  authorId: Types.ObjectId;
  authorName: string;
  viewsCount: number;
  category: 'popular' | 'general';
  createdAt?: Date;
  updatedAt?: Date;
}

export const getUserArticles = async (
  authorId: string,
  { page, perPage }: UserArticlesQuery,
): Promise<PaginatedUserArticles> => {
  const authorExists = await User.exists({ _id: authorId });

  if (!authorExists) {
    throw new HttpError(404, 'User not found');
  }

  const skip = (page - 1) * perPage;

  const [articles, totalItems] = await Promise.all([
    Article.find({ authorId })
      .sort({ publicationDate: -1 })
      .skip(skip)
      .limit(perPage)
      .lean<LeanArticle[]>(),
    Article.countDocuments({ authorId }),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data: articles.map((article) => ({
      id: article._id.toString(),
      title: article.title,
      description: article.description,
      imageUrl: article.imageUrl,
      publicationDate: article.publicationDate,
      authorId: article.authorId.toString(),
      authorName: article.authorName,
      viewsCount: article.viewsCount,
      category: article.category,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
    })),
    page,
    perPage,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
  };
};

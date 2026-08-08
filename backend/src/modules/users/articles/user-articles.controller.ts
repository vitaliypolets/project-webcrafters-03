import type { RequestHandler } from 'express';
import { HttpError } from '../../../utils/HttpError.js';
import { getUserArticles } from './user-articles.service.js';
import type { UserArticlesQuery } from './user-articles.types.js';

export const getUserArticlesController: RequestHandler = async (req, res) => {
  const { userId } = req.params;

  if (typeof userId !== 'string') {
    throw new HttpError(400, 'Invalid userId');
  }

  const query = res.locals.userArticlesQuery as UserArticlesQuery;
  const result = await getUserArticles(userId, query);

  res.status(200).json(result);
};

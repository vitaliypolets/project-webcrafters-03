import { Request, Response } from 'express';
import { getArticleDetails } from './article-details.service.js';
import createHttpError from 'http-errors';

const getArticleById = async (req: Request<{ articleId: string }>, res: Response):Promise<void> => {
  const { articleId } = req.params;
  const userId = (req as Request & { user?: { _id: string } }).user?._id;

  const article = await getArticleDetails(articleId, userId);

  if (!article) {
    throw createHttpError(404, 'Article not found');
  }

  res.status(200).json(article);
};

export { getArticleById };

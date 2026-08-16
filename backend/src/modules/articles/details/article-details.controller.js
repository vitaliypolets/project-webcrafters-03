import { getArticleDetails } from './article-details.service.js';
import createHttpError from 'http-errors';

const getArticleById = async (req, res) => {
  const { articleId } = req.params;
  const userId = req.user?.userId || null;

  const article = await getArticleDetails(articleId, userId);

  if (!article) {
    throw createHttpError(404, 'Article not found');
  }

  res.status(200).json({
    data: article,
    message: 'Success',
  });
};

export { getArticleById };

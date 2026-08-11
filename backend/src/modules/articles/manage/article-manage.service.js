// TODO (учасник №12): business logic and database access

import mongoose from 'mongoose';

import { Article } from '../../../models/Article.js';
import { HttpError } from '../../../utils/HttpError.js';

const getArticleById = async (articleId) => {
  if (!mongoose.isValidObjectId(articleId)) {
    throw new HttpError(400, 'Invalid article id');
  }

  const article = await Article.findById(articleId);

  if (!article) {
    throw new HttpError(404, 'Article not found');
  }

  return article;
};

const checkArticleOwner = (article, userId) => {
  if (article.authorId.toString() !== userId.toString()) {
    throw new HttpError(403, 'You are not allowed to modify this article');
  }
};

const updateArticle = async ({ articleId, data, userId }) => {
  const article = await getArticleById(articleId);

  checkArticleOwner(article, userId);

  const allowedFields = ['title', 'description', 'article', 'publicationDate', 'category'];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      article[field] = data[field];
    }
  }

  await article.save();

  return article;
};

const deleteArticle = async ({ articleId, userId }) => {
  const article = await getArticleById(articleId);

  checkArticleOwner(article, userId);

  await article.deleteOne();
};

export { updateArticle, deleteArticle };

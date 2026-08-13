import mongoose from 'mongoose';

import cloudinary from '../../../config/cloudinary.js';
import { Article } from '../../../models/Article.js';
import { HttpError } from '../../../utils/HttpError.js';
import { saveFileToCloudinary } from '../../../utils/saveFileToCloudinary.js';

const getArticleById = async (articleId) => {
  if (!mongoose.isValidObjectId(articleId)) {
    throw new HttpError(400, 'Invalid article id');
  }

  const article = await Article.findById(articleId).select('+imagePublicId');

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

const updateArticle = async ({ articleId, data, file, userId }) => {
  const article = await getArticleById(articleId);

  checkArticleOwner(article, userId);

  const allowedFields = ['title', 'description', 'article', 'publicationDate', 'category'];

  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      article[field] = data[field];
    }
  }

  if (file) {
    const oldImagePublicId = article.imagePublicId;
    const image = await saveFileToCloudinary(file);

    article.imageUrl = image.secure_url;
    article.imagePublicId = image.public_id;

    if (oldImagePublicId) {
      await cloudinary.uploader.destroy(oldImagePublicId);
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

// TODO (учасник №11): controllers
import createHttpError from 'http-errors';
import mongoose from 'mongoose';
import { getArticlesListService } from './articles-list.service.js';

export const getArticlesListController = async (req, res) => {
  const { page, authorId } = req.query;

  if (page !== undefined) {
    const isPositiveInteger = /^\d+$/.test(page) && Number(page) > 0;

    if (!isPositiveInteger) {
      throw createHttpError(400, 'Parameter "page" must be a positive integer');
    }
  }

  if (authorId !== undefined) {
    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      throw createHttpError(400, 'Invalid authorId format');
    }
  }

  const result = await getArticlesListService(req.query);

  res.status(200).json(result);
};

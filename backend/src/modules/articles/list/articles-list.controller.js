// TODO (учасник №11): controllers
import { getArticlesListService } from './articles-list.service.js';
import { parseGetArticlesQuery } from './articles-list.validation.js';

export const getArticlesListController = async (req, res, next) => {
  try {
    const parsedQuery = parseGetArticlesQuery(req.query);
    const result = await getArticlesListService(parsedQuery);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

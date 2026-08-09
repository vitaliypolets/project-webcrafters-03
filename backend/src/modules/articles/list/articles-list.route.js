import { Router } from 'express';

export const articlesListRouter = Router();

// TODO (учасник №11): додайте методи, middleware та controller відповідно до API-контракту.
articlesListRouter.use((_req, res) => {
  res.status(501).json({ status: 501, message: 'Module is not implemented yet' });
});

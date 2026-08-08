import { Router } from 'express';

export const userArticlesRouter = Router();

// TODO (учасник №8): додайте методи, middleware та controller відповідно до API-контракту.
userArticlesRouter.use((_req, res) => {
  res.status(501).json({ status: 501, message: 'Module is not implemented yet' });
});

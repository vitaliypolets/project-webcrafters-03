import { Router } from 'express';

export const articleDetailsRouter = Router();

// TODO (учасник №10): додайте методи, middleware та controller відповідно до API-контракту.
articleDetailsRouter.use((_req, res) => {
  res.status(501).json({ status: 501, message: 'Module is not implemented yet' });
});

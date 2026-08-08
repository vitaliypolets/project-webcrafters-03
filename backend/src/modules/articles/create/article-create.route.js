import { Router } from 'express';

export const articleCreateRouter = Router();

// TODO (учасник №13): додайте методи, middleware та controller відповідно до API-контракту.
articleCreateRouter.use((_req, res) => {
  res.status(501).json({ status: 501, message: 'Module is not implemented yet' });
});

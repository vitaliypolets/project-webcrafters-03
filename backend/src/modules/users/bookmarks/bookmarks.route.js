import { Router } from 'express';

export const bookmarksRouter = Router();

// TODO (учасник №9): додайте методи, middleware та controller відповідно до API-контракту.
bookmarksRouter.use((_req, res) => {
  res.status(501).json({ status: 501, message: 'Module is not implemented yet' });
});

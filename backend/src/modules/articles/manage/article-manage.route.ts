import { Router } from 'express';

export const articleManageRouter = Router();

// TODO (учасник №12): додайте методи, middleware та controller відповідно до API-контракту.
articleManageRouter.use((_req, res) => {
  res.status(501).json({ status: 501, message: 'Module is not implemented yet' });
});

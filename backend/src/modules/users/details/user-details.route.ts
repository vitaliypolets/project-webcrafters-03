import { Router } from 'express';

export const userDetailsRouter = Router();

// TODO (учасник №7): додайте методи, middleware та controller відповідно до API-контракту.
userDetailsRouter.use((_req, res) => {
  res.status(501).json({ status: 501, message: 'Module is not implemented yet' });
});

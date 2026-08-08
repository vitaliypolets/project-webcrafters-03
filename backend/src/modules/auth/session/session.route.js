import { Router } from 'express';

export const sessionRouter = Router();

// TODO (учасник №4): додайте методи, middleware та controller відповідно до API-контракту.
sessionRouter.use((_req, res) => {
  res.status(501).json({ status: 501, message: 'Module is not implemented yet' });
});

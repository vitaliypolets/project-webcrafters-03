import { Router } from 'express';

export const registerRouter = Router();

// TODO (учасник №2): додайте методи, middleware та controller відповідно до API-контракту.
registerRouter.use((_req, res) => {
  res.status(501).json({ status: 501, message: 'Module is not implemented yet' });
});

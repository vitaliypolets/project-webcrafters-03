import { Router } from 'express';

export const loginRouter = Router();

// TODO (учасник №3): додайте методи, middleware та controller відповідно до API-контракту.
loginRouter.use((_req, res) => {
  res.status(501).json({ status: 501, message: 'Module is not implemented yet' });
});

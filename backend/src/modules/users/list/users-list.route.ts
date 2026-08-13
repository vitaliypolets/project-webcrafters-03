import { Router } from 'express';

export const usersListRouter = Router();

// TODO (учасник №6): додайте методи, middleware та controller відповідно до API-контракту.
usersListRouter.use((_req, res) => {
  res.status(501).json({ status: 501, message: 'Module is not implemented yet' });
});

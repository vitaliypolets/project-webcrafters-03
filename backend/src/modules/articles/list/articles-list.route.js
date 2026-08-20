import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../../config/env.js';
import { getArticlesListController } from './articles-list.controller.js';

export const articlesListRouter = Router();

const optionalAuth = (req, _res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    try {
      req.user = jwt.verify(token, env.accessTokenSecret);
    } catch {
      req.user = null;
    }
  } else {
    req.user = null;
  }
  next();
};

articlesListRouter.get('/', optionalAuth, getArticlesListController);

// export const articlesListRouter = Router();

// // TODO (учасник №11): додайте методи, middleware та controller відповідно до API-контракту.
// articlesListRouter.use((_req, res) => {
//   res.status(501).json({ status: 501, message: 'Module is not implemented yet' });
// });

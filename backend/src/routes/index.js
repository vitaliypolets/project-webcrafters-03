import { Router } from 'express';
import { healthRouter } from '../modules/health/health.route.js';
import { userArticlesRouter } from '../modules/users/articles/index.js';
import { userDetailsRouter } from '../modules/users/details/index.js';

export const apiRouter = Router();
apiRouter.use('/health', healthRouter);
apiRouter.use('/users', userArticlesRouter);
apiRouter.use('/users', userDetailsRouter);

// Team Lead mounts participant modules here after their PRs are ready.
// apiRouter.use('/auth/register', registerRouter);
// apiRouter.use('/auth/login', loginRouter);
// apiRouter.use('/auth/session', sessionRouter);
// apiRouter.use('/users', usersRouter);
// apiRouter.use('/articles', articlesRouter);

import { Router } from 'express';
/*import { healthRouter } from '../modules/health/health.route.js';
import { userArticlesRouter } from '../modules/users/articles/index.js';
import { userDetailsRouter } from '../modules/users/details/index.js';
import { usersListRouter } from '../modules/users/list/index.js';
import { loginRouter } from '../modules/auth/login/index.js';
import { articleDetailsRouter } from '../modules/articles/details/index.js';
import { articleCreateRouter } from '../modules/articles/create/index.js';
*/
import { meRouter } from '../modules/users/me/index.js'

export const apiRouter = Router();

/* apiRouter.use('/health', healthRouter);
apiRouter.use('/users', usersListRouter);
apiRouter.use('/users', userDetailsRouter);
apiRouter.use('/users', userArticlesRouter);
apiRouter.use('/auth/login', loginRouter);
apiRouter.use('/articles', articleDetailsRouter);
apiRouter.use('/articles', articleCreateRouter);
*/

// Mount only after corresponding feature PRs are accepted:
// apiRouter.use('/auth/register', registerRouter);
// apiRouter.use('/auth/login', loginRouter);
// apiRouter.use('/auth/session', sessionRouter);
 apiRouter.use('/users/me', meRouter);
// apiRouter.use('/users', bookmarksRouter);
// apiRouter.use('/articles', articlesListRouter);
// apiRouter.use('/articles', articleManageRouter);

import { Router } from 'express';

import { getArticleById } from './article-details.controller.js';
import { validateArticleParams } from './article-details.validation.js';

const router = Router();

router.get('/:articleId', validateArticleParams, getArticleById);

export { router as articleDetailsRouter };
export default router;

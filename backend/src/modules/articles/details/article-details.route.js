import { Router } from 'express';

import { getArticleById } from './article-details.controller.js';
import { validateArticleParams } from './article-details.validation.js';

const articleDetailsRouter = Router();

export default articleDetailsRouter.get('/:articleId', validateArticleParams, getArticleById);

import { Router } from 'express';

import { getArticleById } from './article-details.controller.js';
import { validateArticleParams } from './article-details.validation.js';

export const articleDetailsRouter = Router();

articleDetailsRouter.get('/:articleId', validateArticleParams, getArticleById);

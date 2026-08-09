import { Router } from 'express';

import { authenticate } from '../../../middlewares/authenticate.js';
import { upload } from '../../../middlewares/upload.js';
import { controllerWrapper } from '../../../middlewares/controllerWrapper.js';

import { createArticleController } from './article-create.controller.js';
import { validateCreateArticle } from './article-create.validation.js';

export const articleCreateRouter = Router();

articleCreateRouter.post(
  '/',
  authenticate,
  upload.single('photo'),
  validateCreateArticle,
  controllerWrapper(createArticleController),
);

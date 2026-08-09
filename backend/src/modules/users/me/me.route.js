import { Router } from 'express';
import { controllerWrapper } from '../../../middlewares/controllerWrapper.js';
import { authenticate } from '../../../middlewares/authenticate.js';
import {
  getMeController,
  updateMeController,
} from './me.controller.js';
import { validateBody, updateMeSchema } from './me.validation.js';

export const meRouter = Router();

meRouter.get(
  '/',
  authenticate,
  controllerWrapper(getMeController),
);

meRouter.patch(
  '/',
  authenticate,
  validateBody(updateMeSchema),
  controllerWrapper(updateMeController),
);

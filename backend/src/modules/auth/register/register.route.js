import { Router } from 'express';
import { controllerWrapper } from '../../../middlewares/controllerWrapper.js';
import { registerController } from './register.controller.js';
import { avatarUpload, registerBodySchema, validateBody } from './register.validation.js';

export const registerRouter = Router();

registerRouter.post(
  '/',
  avatarUpload.single('avatar'),
  validateBody(registerBodySchema),
  controllerWrapper(registerController),
);

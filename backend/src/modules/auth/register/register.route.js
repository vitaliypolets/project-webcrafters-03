import { Router } from 'express';
import multer from 'multer';
import { controllerWrapper } from '../../../middlewares/controllerWrapper.js';
import { HttpError } from '../../../utils/HttpError.js';
import { checkEmailController, registerController } from './register.controller.js';
import {
  avatarUpload,
  checkEmailBodySchema,
  registerBodySchema,
  validateBody,
} from './register.validation.js';

export const registerRouter = Router();

const handleAvatarUpload = (req, res, next) => {
  avatarUpload.single('avatar')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      const message =
        error.code === 'LIMIT_FILE_SIZE' ? 'Avatar must be up to 1 MB' : error.message;
      return next(new HttpError(400, message));
    }
    if (error) return next(error);
    next();
  });
};

const registerOrCheckEmail = (req, res, next) => {
  if (req.query.mode !== 'check-email') {
    return next();
  }

  validateBody(checkEmailBodySchema)(req, res, (error) => {
    if (error) return next(error);
    controllerWrapper(checkEmailController)(req, res, next);
  });
};

registerRouter.post(
  '/',
  registerOrCheckEmail,
  handleAvatarUpload,
  validateBody(registerBodySchema),
  controllerWrapper(registerController),
);

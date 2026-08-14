import { Router } from 'express';
import multer from 'multer';
import { controllerWrapper } from '../../../middlewares/controllerWrapper.js';
import { HttpError } from '../../../utils/HttpError.js';
import { registerController } from './register.controller.js';
import { avatarUpload, registerBodySchema, validateBody } from './register.validation.js';

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

registerRouter.post(
  '/',
  handleAvatarUpload,
  validateBody(registerBodySchema),
  controllerWrapper(registerController),
);

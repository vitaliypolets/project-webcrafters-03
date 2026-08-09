import { Router } from 'express';
import {
  usersRouter,
  updateMeController,
} from './me.controller.js';

export const meRouter = Router();

meRouter.get('/', usersRouter);
meRouter.patch('/', updateMeController);

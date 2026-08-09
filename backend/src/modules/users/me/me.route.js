import { Router } from 'express';
import {
  getMeController,
  updateMeController,
} from './me.controller.js';

export const meRouter = Router();

meRouter.get('/', getMeController);
meRouter.patch('/', updateMeController);

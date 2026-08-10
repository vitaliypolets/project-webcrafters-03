import { Router } from 'express';
import {
  getMe,
  updateMe
} from './me.controller.js';

import { authenticate } from '../../../middlewares/authenticate.js';


const router = Router();



router.get(
  '/',
  authenticate,
  getMe
);



router.patch(
  '/',
  authenticate,
  updateMe
);



export {
  router as meRouter
};

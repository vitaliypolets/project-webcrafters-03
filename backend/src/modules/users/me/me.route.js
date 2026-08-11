import { Router } from 'express';
import {
  getMe,
  updateMe
} from './me.controller.js';
import { upload } from '../../../middlewares/upload.js';

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
  upload.single('avatar'),
  updateMe
);


export {
  router as meRouter
};

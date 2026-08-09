import { Router } from 'express';
import { getUsersListController } from './users-list.controller.js';

export const usersListRouter = Router();

// TODO (учасник №6): додайте методи, middleware та controller відповідно до API-контракту.
usersListRouter.get('/', getUsersListController);

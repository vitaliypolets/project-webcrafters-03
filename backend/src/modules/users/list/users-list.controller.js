// TODO (учасник №6): controllers
import { Request, Response } from 'express';
import { controllerWrapper } from '../../../middlewares/controllerWrapper.js';
import { parseGetUsersQuery } from './users-list.validation.js';
import { getUsersListService } from './users-list.service.js';
import { GetUsersQuery } from './users-list.types.js';

export const getUsersListController = controllerWrapper(
  async (req: Request<object, object, object, GetUsersQuery>, res: Response) => {
    const parsedQuery = parseGetUsersQuery(req.query);
    const result = await getUsersListService(parsedQuery);
    res.status(200).json(result);
  },
);

export {};

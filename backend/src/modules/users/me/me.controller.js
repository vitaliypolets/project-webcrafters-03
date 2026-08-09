// TODO (учасник №5): controllers
import {
  getMeService,
  updateMeService,
} from './me.service.js';

export const usersRouter = async (req, res, next) => {
  try {
    const user = await getMeService(req.user._id);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateMeController = async (req, res, next) => {
  try {
    const user = await updateMeService(req.user._id, req.body);

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

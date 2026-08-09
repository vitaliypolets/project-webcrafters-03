// TODO (учасник №5): controllers
import {
  getMe,
  updateMe,
} from './me.service.js';

export const getMeController = async (req, res) => {
  const user = await getMe(req.user._id);

  res.status(200).json({
    data: {
      user,
    },
    message: 'Success',
  });
};

export const updateMeController = async (req, res) => {
  const user = await updateMe(req.user._id, req.body);

  res.status(200).json({
    data: {
      user,
    },
    message: 'Success',
  });
};

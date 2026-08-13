// TODO (учасник №5): controllers

import {
  getUserMe,
  updateUserMe,
} from './me.service.js';

import {
  saveFileToCloudinary,
} from '../../../utils/saveFileToCloudinary.js';


export const getMe = async (req, res, next) => {
  try {
    const user = await getUserMe(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


export const updateMe = async (req, res, next) => {
  try {
    const data = {
      ...req.body,
    };

    if (req.file) {
      const avatar = await saveFileToCloudinary(req.file);

      data.avatarUrl = avatar.url;
      data.avatarPublicId = avatar.publicId;
    }

    const user = await updateUserMe(
      req.user.id,
      data,
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

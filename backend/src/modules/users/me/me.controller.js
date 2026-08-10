// TODO (учасник №5): controllers
import {
  getUserMe,
  updateUserMe
} from './me.service.js';



export const getMe = async (
  req,
  res,
  next
) => {

  try {

    const user = await getUserMe(
      req.user.id
    );


    res.status(200).json({
      success: true,
      data: user
    });


  } catch(error) {

    next(error);

  }

};





export const updateMe = async (
  req,
  res,
  next
) => {

  try {

    const user = await updateUserMe(
      req.user.id,
      req.body
    );


    res.status(200).json({
      success:true,
      data:user
    });


  } catch(error) {

    next(error);

  }

};

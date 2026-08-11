import { HttpError } from '../../../utils/HttpError.js';
import { createAuthSession } from '../shared/authSession.js';
import { createAccessToken, createRefreshToken } from '../shared/authTokens.js';
import { setAuthCookies } from '../shared/authCookies.js';
import {
  createUser,
  findUserByEmail,
  hashPassword,
  toPublicUser,
  uploadAvatarToCloudinary,
} from './register.service.js';

export const registerController = async (req, res) => {
  const { name, email, password } = req.body;

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new HttpError(409, 'Email in use');
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser({
    name,
    email,
    passwordHash,
  });

  if (req.file) {
    const uploadResult = await uploadAvatarToCloudinary(req.file.buffer, user._id);

    user.avatarUrl = uploadResult.secure_url;
    user.avatarPublicId = uploadResult.public_id;

    await user.save();
  }

  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);

  const session = await createAuthSession(user._id, refreshToken);

  setAuthCookies(res, refreshToken, session._id.toString());

  res.status(201).json({
    data: {
      user: toPublicUser(user),
      accessToken,
    },
    message: 'Success',
  });
};

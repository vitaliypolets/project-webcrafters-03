import bcrypt from "bcrypt";
import cloudinary from "../../../config/cloudinary.js";
import { User } from "../../../models/User.js";

const SALT_ROUNDS = 10;

export const findUserByEmail = (email) => User.findOne({ email: email.toLowerCase().trim() });

export const hashPassword = (password) => bcrypt.hash(password, SALT_ROUNDS);

export const createUser = ({ name, email, passwordHash }) =>
  User.create({ name, email, passwordHash });

export const toPublicUser = (user) => {
  const plain = typeof user.toObject === "function" ? user.toObject() : user;
  return {
    id: plain._id.toString(),
    name: plain.name,
    email: plain.email,
    avatarUrl: plain.avatarUrl ?? null,
    articlesAmount: plain.articlesAmount ?? 0,
    createdAt: plain.createdAt,
    updatedAt: plain.updatedAt,
  };
};

export const uploadAvatarToCloudinary = (buffer, userId) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "harmoniq/avatars",
        public_id: `avatar_${userId}`,
        resource_type: "image",
        overwrite: true,
        unique_filename: false,
        transformation: [
          { width: 500, height: 500, crop: "fill", gravity: "auto" },
          { fetch_format: "auto", quality: "auto" },
        ],
      },
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    uploadStream.end(buffer);
  });

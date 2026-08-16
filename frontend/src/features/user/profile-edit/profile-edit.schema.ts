import * as Yup from "yup";

export const MAX_AVATAR_SIZE = 1 * 1024 * 1024;

export const ALLOWED_AVATAR_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const profileEditSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(32, "Name must be at most 32 characters")
    .required("Name is required"),

  avatar: Yup.mixed<File>()
    .nullable()
    .test(
      "fileSize",
      "Avatar must be up to 1 MB",
      (file) => !file || (file as File).size <= MAX_AVATAR_SIZE,
    )
    .test(
      "fileType",
      "Only JPEG, PNG and WebP are allowed",
      (file) => !file || ALLOWED_AVATAR_MIME_TYPES.includes((file as File).type),
    ),
});

// TODO (учасник №5): request validation
import { z } from 'zod';
import { HttpError } from '../../../utils/HttpError.js';

export const updateMeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(32, 'Name must be at most 32 characters')
    .optional(),

  avatarUrl: z
    .string()
    .url('Invalid avatar URL')
    .optional(),
});

export const validateBody = (schema) => (req, _res, next) => {
  const result = schema.safeParse(req.body ?? {});

  if (!result.success) {
    return next(
      new HttpError(
        400,
        'Validation error',
        result.error.flatten().fieldErrors,
      ),
    );
  }

  req.body = result.data;
  next();
};

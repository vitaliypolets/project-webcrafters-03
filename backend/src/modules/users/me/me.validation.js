// TODO (учасник №5): request validation

import { z } from 'zod';

export const updateMeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(32, 'Name must be at most 32 characters')
    .optional(),
});

export const validateUpdateMe = (req, res, next) => {
  const result = updateMeSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      errors: result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  const hasName = result.data.name !== undefined;
  const hasAvatar = req.file !== undefined;

  if (!hasName && !hasAvatar) {
    return res.status(400).json({
      success: false,
      errors: [
        {
          field: 'body',
          message: 'At least name or avatar is required',
        },
      ],
    });
  }

  req.body = result.data;

  next();
};

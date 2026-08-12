// TODO (учасник №5): request validation
// me.validation.js

import { z } from 'zod';

export const updateMeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(32, 'Name must be at most 32 characters')
    .regex(
      /^[A-Za-zА-Яа-яІіЇїЄєҐґ\s'-]+$/,
      'Name can contain only letters',
    )
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

  // Передаём уже очищенные/проверенные данные дальше
  req.body = result.data;

  next();
};

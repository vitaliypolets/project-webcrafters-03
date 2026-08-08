// TODO (учасник №13): request validation

import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must contain at least 3 characters')
    .max(48, 'Title must contain at most 48 characters'),

  description: z
    .string()
    .trim()
    .min(100, 'Description must contain at least 100 characters')
    .max(4000, 'Description must contain at most 4000 characters'),

  publicationDate: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}$/,
      'Publication date must be in YYYY-MM-DD format',
    ),
});

export const validateCreateArticle = (req, res, next) => {
  const result = createArticleSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: 'Validation error',
      errors: result.error.flatten().fieldErrors,
    });
  }

  req.body = result.data;

  next();
};

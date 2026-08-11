// TODO (учасник №12): request validation

import { z } from 'zod';

export const updateArticleSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, 'Title must contain at least 3 characters')
      .max(48, 'Title must contain at most 48 characters')
      .optional(),

    description: z
      .string()
      .trim()
      .min(100, 'Description must contain at least 100 characters')
      .max(4000, 'Description must contain at most 4000 characters')
      .optional(),

    article: z.string().trim().min(1, 'Article text is required').optional(),

    publicationDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Publication date must be in YYYY-MM-DD format')
      .optional(),

    category: z.enum(['popular', 'general']).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update an article',
  });

export const validateUpdateArticle = (req, res, next) => {
  const result = updateArticleSchema.safeParse(req.body);

  if (!result.success) {
    const tree = z.treeifyError(result.error);

    return res.status(400).json({
      status: 400,
      message: 'Validation error',
      details: tree,
    });
  }

  req.body = result.data;

  next();
};

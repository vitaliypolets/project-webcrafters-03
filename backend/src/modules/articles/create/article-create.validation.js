// TODO (учасник №13): request validation

import { z } from 'zod';

export const createArticleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must contain at least 3 characters')
    .max(48, 'Title must contain at most 48 characters'),

  article: z
    .string()
    .trim()
    .min(100, 'Article must contain at least 100 characters')
    .max(4000, 'Article must contain at most 4000 characters'),

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
    const tree = z.treeifyError(result.error);

    const errors = {
      title: tree.properties?.title?.errors ?? [],
      article: tree.properties?.article?.errors ?? [],
      publicationDate: tree.properties?.publicationDate?.errors ?? [],
    };

    return res.status(400).json({
      message: 'Validation error',
      errors,
    });
  }

  req.body = result.data;

  next();
};

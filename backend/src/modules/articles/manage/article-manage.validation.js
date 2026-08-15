// TODO (учасник №12): request validation

import { z } from "zod";

export const updateArticleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title must contain at least 3 characters")
    .max(48, "Title must contain at most 48 characters")
    .optional(),

  article: z
    .string()
    .trim()
    .min(100, "Article must contain at least 100 characters")
    .max(4000, "Article must contain at most 4000 characters")
    .optional(),

  publicationDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Publication date must be in YYYY-MM-DD format")
    .optional(),
});

export const validateUpdateArticle = (req, res, next) => {
  const body = req.body ?? {};

  const result = updateArticleSchema.safeParse(body);

  if (!result.success) {
    const tree = z.treeifyError(result.error);

    const errors = {
      title: tree.properties?.title?.errors ?? [],
      article: tree.properties?.article?.errors ?? [],
      publicationDate: tree.properties?.publicationDate?.errors ?? [],
    };

    return res.status(400).json({
      message: "Validation error",
      errors,
    });
  }

  if (Object.keys(result.data).length === 0 && !req.file) {
    return res.status(400).json({
      message: "Validation error",
      errors: {
        general: ["At least one field or image is required to update an article"],
      },
    });
  }

  req.body = result.data;

  next();
};

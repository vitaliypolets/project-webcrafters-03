// TODO (учасник №13): controllers

import { createArticle } from './article-create.service.js';

export const createArticleController = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: 'Article image is required',
    });
  }

  const article = await createArticle({
    data: req.body,
    file: req.file,
    user: req.user,
  });

  res.status(201).json(article);

console.log('BODY:', req.body);
console.log('FILE:', req.file?.originalname);
console.log('USER:', req.user?._id);
};


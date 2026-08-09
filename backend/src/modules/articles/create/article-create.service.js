// TODO (учасник №13): business logic and database access
import { Article } from '../../../models/Article.js';
import { HttpError } from '../../../utils/HttpError.js';
import { saveFileToCloudinary } from '../../../utils/saveFileToCloudinary.js';

export const createArticle = async ({ data, file, user }) => {
  if (!file) {
    throw new HttpError(400, 'Article image is required');
  }

  const authorId = user._id;

  const image = await saveFileToCloudinary(
    file.buffer,
    authorId,
  );

  const article = await Article.create({
    title: data.title,
    description: data.description,
    publicationDate: data.publicationDate,
    imageUrl: image.secure_url,
    imagePublicId: image.public_id,
    authorId,
    authorName: user.name,
  });

  return {
    id: article._id.toString(),
    title: article.title,
    description: article.description,
    imageUrl: article.imageUrl,
    publicationDate: article.publicationDate,
    authorId: article.authorId.toString(),
    authorName: article.authorName,
    viewsCount: article.viewsCount,
    category: article.category,
    createdAt: article.createdAt,
    updatedAt: article.updatedAt,
  };
};

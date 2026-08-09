// TODO (учасник №13): business logic and database access
import { Article } from '../../../models/Article.js';
import { User } from '../../../models/User.js';
import { HttpError } from '../../../utils/HttpError.js';
import { saveFileToCloudinary } from '../../../utils/saveFileToCloudinary.js';

export const createArticle = async (
  authorId,
  { title, description, publicationDate },
  file,
) => {
  if (!file) {
    throw new HttpError(400, 'Photo is required');
  }

  const author = await User.findById(authorId).select('name');

  if (!author) {
    throw new HttpError(404, 'User not found');
  }

  const image = await saveFileToCloudinary(
    file.buffer,
    authorId,
  );

  const article = await Article.create({
    title,
    description,
    publicationDate,
    imageUrl: image.secure_url,
    imagePublicId: image.public_id,
    authorId,
    authorName: author.name,
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

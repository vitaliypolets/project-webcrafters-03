// TODO (учасник №13): business logic and database access
import { Article } from '../../../models/Article.js';
import { User } from '../../../models/User.js';
import { HttpError } from '../../../utils/HttpError.js';
import { saveFileToCloudinary } from '../../../utils/saveFileToCloudinary.js';

export const createArticle = async ({ data, file, user }) => {
  if (!file) {
    throw new HttpError(400, 'Article image is required');
  }

  const image = await saveFileToCloudinary(file);

  const article = await Article.create({
    title: data.title,
    description: data.description,
    article: data.article,
    publicationDate: data.publicationDate,
    imageUrl: image.secure_url,
    imagePublicId: image.public_id,
    authorId: user._id,
    authorName: user.name,
    viewsCount: 0,
    category: data.category,
  });

  await User.findByIdAndUpdate(user._id, {
    $inc: { articlesAmount: 1 },
  });

  return {
    id: article._id.toString(),
    title: article.title,
    description: article.description,
    article: article.article,
    imageUrl: article.imageUrl,
    imagePublicId: article.imagePublicId,
    publicationDate: article.publicationDate,
    authorId: article.authorId.toString(),
    authorName: article.authorName,
    viewsCount: article.viewsCount,
    category: article.category,
  };
};

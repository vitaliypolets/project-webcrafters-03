// TODO (учасник №13): business logic and database access
import { Article } from '../../models/article.js';
import { saveFileToCloudinary } from '../../utils/saveFileToCloudinary.js';

export const createArticle = async ({ data, file, user }) => {
  const { secure_url, public_id } = await saveFileToCloudinary(
    file.buffer,
    `article-${user._id}`,
  );

  const article = await Article.create({
  title: data.title,
  description: data.description,
  publicationDate: new Date(data.publicationDate),

  imageUrl: secure_url,
  imagePublicId: public_id,

  authorId: user._id,
  authorName: user.name,
});

  return article;
};

import mongoose from 'mongoose';
import { Article } from '../../../models/Article.js';
import { User } from '../../../models/User.js';

const getArticleDetails = async (articleId, userId = null) => {
  const article = await Article.findById(articleId).lean();

  if (!article) return null;

  let isBookmarked = false;
  if (userId) {
    const userHasBookmark = await User.exists({
      _id: userId,
      savedArticles: articleId,
    });

    isBookmarked = Boolean(userHasBookmark);
  };

  const recommendations = await Article.aggregate([
    { $match: { _id: { $ne: new mongoose.Types.ObjectId(articleId) } } },
    { $sample: { size: 3 } }
  ]);
  
  return {
    article,
    author: {
      _id: article.authorId,
      name: article.authorName,
    },
    isBookmarked,
    recommendations,
  };
}
export { getArticleDetails };

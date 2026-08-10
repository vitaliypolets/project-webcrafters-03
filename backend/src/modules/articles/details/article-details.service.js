import mongoose from 'mongoose';
import { Article } from '../../../models/Article.js';
import { User } from '../../../models/User.js';

const getArticleDetails = async (articleId, userId = null) => {
  const article = await Article.findByIdAndUpdate(
    articleId,
    { $inc: { viewsCount: 1 } },
    { new: true }
  ).lean();

  if (!article) return null;

  const author = await User.findById(article.authorId, 'name').lean();

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
    author: author? {
        _id: author._id,
        name: author.name,
      }: null,
    isBookmarked,
    recommendations,
  };
}

export { getArticleDetails };

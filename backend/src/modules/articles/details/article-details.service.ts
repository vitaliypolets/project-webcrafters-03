import { Article } from '../../../models/Article.js';

const getArticleDetails = async (articleId: string, userId?: string) => {
  const article = await Article.findById(articleId).lean();
  if (!article) return null;

  if (!userId) {
    return { ...article, isBookmarked: false };
  }

  const isBookmarked = false;
  if (userId) {
    // TODO:
    // isBookmarked = await Bookmark.exists({ articleId, userId });
  }

  const recommendations = await Article.find({ _id: { $ne: articleId } })
    .limit(3)
    .lean();
  
  return {
    article,
    author: {
      _id: article.authorId,
      name: article.authorName,
    },
    isBookmarked: Boolean(isBookmarked),
    recommendations,
  };
}
export { getArticleDetails };

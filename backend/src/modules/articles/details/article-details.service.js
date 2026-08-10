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

  const currentObjectId = new mongoose.Types.ObjectId(article._id);
  const recommendations = await Article.aggregate([
    { $match: { 
        _id: { $ne: currentObjectId },
        title: { $ne: article.title }
      }
    },
    { $sample: { size: 3 } },
    {
      $lookup: {
        from: 'users',
        localField: 'authorId',
        foreignField: '_id',
        as: 'author'
      }
    },
    {
      $unwind: {
        path: '$author',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 1,
        title: 1,
        description: 1,
        imageUrl: 1,
        publicationDate: 1,
        category: 1,
        viewsCount: 1,
        author: {
          _id: '$author._id',
          name: '$author.name'
        }
      }
    },
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

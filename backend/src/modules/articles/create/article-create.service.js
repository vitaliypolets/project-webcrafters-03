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

  const generateArticleDescription = article => {
  const cleanArticle = article
    .replace(/\s+/g, ' ')
    .trim();

  if (!cleanArticle) {
    return '';
  }

  const sentences = cleanArticle
    .split(/(?<=[.!?])\s+/)
    .filter(sentence => sentence.length > 20);

  if (sentences.length <= 2) {
    return sentences.join(' ');
  }

  const stopWords = new Set([
    'і',
    'й',
    'та',
    'а',
    'але',
    'або',
    'що',
    'це',
    'як',
    'у',
    'в',
    'на',
    'до',
    'з',
    'із',
    'за',
    'для',
    'про',
    'по',
    'від',
    'не',
    'так',
    'також',
    'можна',
    'який',
    'яка',
    'яке',
    'які',
  ]);

  const words = cleanArticle
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.has(word));

  const frequencies = {};

  for (const word of words) {
    frequencies[word] = (frequencies[word] || 0) + 1;
  }

  const scoredSentences = sentences.map(sentence => {
    const sentenceWords = sentence
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, '')
      .split(/\s+/);

    const score = sentenceWords.reduce(
      (total, word) => total + (frequencies[word] || 0),
      0,
    );

    return {
      sentence,
      score,
    };
  });

  const selectedSentences = scoredSentences
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .sort(
      (a, b) =>
        sentences.indexOf(a.sentence) -
        sentences.indexOf(b.sentence),
    );

  return selectedSentences
    .map(item => item.sentence)
    .join(' ');
};
  
  const description = generateArticleDescription(data.article);
  
  const article = await Article.create({
    title: data.title,
    description,
    article: data.article,
    publicationDate: data.publicationDate,
    imageUrl: image.secure_url,
    imagePublicId: image.public_id,
    authorId: user._id,
    viewsCount: 0,
  });

  const author = await User.findById(user._id).select('name');

  await User.findByIdAndUpdate(user._id, {
    $inc: { articlesAmount: 1 },
  });

  return {
    id: article._id.toString(),
    title: article.title,
    description: article.description,
    article: article.article,
    imageUrl: article.imageUrl,
    publicationDate: article.publicationDate,
    authorId: article.authorId.toString(),
    authorName: author.name,
    viewsCount: article.viewsCount,
    category: article.category,
  };
};

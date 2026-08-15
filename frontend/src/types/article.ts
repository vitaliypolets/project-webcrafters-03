import type { PublicUser } from './user';

export type ArticleEntity = {
  _id: string;
  title: string;
  description: string;
  article: string;
  imageUrl: string | null;
  imagePublicId: string | null;
  publicationDate: string;
  authorId: string;
  viewsCount: number;
  category: string;
};

export type Article = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  publicationDate: string;
  author: PublicUser;
  isBookmarked?: boolean;
};

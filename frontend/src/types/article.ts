import type { PublicUser } from './user';

export type Article = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  publicationDate: string;
  author: PublicUser;
  isBookmarked?: boolean;
};

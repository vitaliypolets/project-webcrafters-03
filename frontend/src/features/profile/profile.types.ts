import type { ReactNode } from 'react';
import type { PublicUser } from '@/types/user';

export type ProfileTab = 'my-articles' | 'saved-articles';

export type ProfileDetails = Omit<PublicUser, 'articlesAmount'> & {
  articlesAmount: number;
};

export type ProfileDetailsApiResponse = {
  data: {
    id: string;
    name: string;
    avatar: string | null;
    articlesAmount: number;
  };
};

export type ProfileInfoProps = {
  name: string;
  avatarUrl: string | null;
  articlesAmount?: number;
  isArticlesAmountLoading?: boolean;
};

export type ProfileTabsProps = {
  myArticles: ReactNode;
  savedArticles: ReactNode;
};

export interface UserArticlesQuery {
  page: number;
  perPage: number;
}

export interface UserArticle {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  publicationDate: Date;
  authorId: string;
  authorName: string;
  viewsCount: number;
  category: 'popular' | 'general';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaginatedUserArticles {
  data: UserArticle[];
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
}

// TODO: реалізувати відповідно до docs/OWNERSHIP_MAP.md
export interface Creator {
  id: string;
  _id: string;
  name: string;
  avatarUrl: string | null;
  articlesCount: number;
}

export interface CreatorsResponse {
  data: {
    users: Creator[];
    page: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
  };
  message: string;
}

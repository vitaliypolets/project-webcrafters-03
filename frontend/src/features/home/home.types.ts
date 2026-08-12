export interface Creator {
  id: string;
  _id: string;
  name: string;
  avatarUrl: string | null;
  articlesAmount: number;
}

export interface CreatorsResponse {
  data: Creator[];
  total: number;
  page: number;
  perPage: number;
  hasNextPage: boolean;
}

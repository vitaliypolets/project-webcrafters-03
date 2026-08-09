// TODO (учасник №6): module types
interface GetUsersQuery {
  page?: string | number;
  perPage?: string | number;
  sort?: 'popular' | 'newest';
  limit?: string | number;
}

interface UserResponseItem {
  _id: string;
  name: string;
  avatarUrl?: string;
  articlesCount?: number;
}

interface GetUsersPaginatedResponse {
  data: UserResponseItem[];
  total: number;
  page: number;
  perPage: number;
  hasNextPage: boolean;
}

export { GetUsersQuery, UserResponseItem, GetUsersPaginatedResponse };

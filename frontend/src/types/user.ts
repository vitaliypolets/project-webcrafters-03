export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  articlesCount?: number;
};

export type PublicUser = Omit<User, 'email'>;

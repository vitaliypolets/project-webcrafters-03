export interface SessionResponseData {
  accessToken: string;
}

export interface RefreshSessionResult {
  user: {
    _id: string;
    name: string;
    avatarUrl?: string | null;
    articlesAmount?: number;
  };
  accessToken: string;
  refreshToken: string;
  sessionId: string;
}

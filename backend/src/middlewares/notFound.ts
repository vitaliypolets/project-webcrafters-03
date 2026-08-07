import type { RequestHandler } from 'express';
export const notFound: RequestHandler = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`) as Error & { status?: number };
  error.status = 404;
  next(error);
};

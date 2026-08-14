import { env } from '../config/env.js';

export const errorHandler = (error, _req, res, _next) => {
  const status = Number(error.status ?? 500);

  res.status(status).json({
    status,
    message: error.message ?? 'Internal server error',
    details: error.details,
    ...(env.nodeEnv !== 'production' ? { stack: error.stack } : {}),
  });
};

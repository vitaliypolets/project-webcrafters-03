import type { RequestHandler } from 'express';

export const controllerWrapper = (controller: RequestHandler): RequestHandler =>
  async (req, res, next) => Promise.resolve(controller(req, res, next)).catch(next);

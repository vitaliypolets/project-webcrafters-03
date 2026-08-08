import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { pinoHttp } from 'pino-http';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFound } from './middlewares/notFound.js';
import { apiRouter } from './routes/index.js';

export const app = express();
app.use(pinoHttp());
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use('/api', apiRouter);
app.use(notFound);
app.use(errorHandler);

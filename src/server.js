import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import fs from 'node:fs';
import path from 'node:path';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

export const setupServer = () => {
  const app = express();

  const swaggerFilePath = path.join(process.cwd(), 'docs', 'swagger.json');
  const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'));

  app.use(pino());
  app.use(cors());
  app.use(cookieParser());
  app.use(express.json());

  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument),
  );

  app.use('/auth', authRouter);
  app.use('/contacts', contactsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
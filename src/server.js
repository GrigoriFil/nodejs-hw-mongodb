import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import contactsRouter from './routers/contacts.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import authRouter from './routers/auth.js';

export const setupServer = () => {
  const app = express();
  app.use(pino());
  app.use(cors());
  app.use(express.json());

  app.use(contactsRouter);
  app.use(cookieParser());
  app.use(express.json());

  app.use(notFoundHandler);

  app.use(errorHandler);

  app.use('/auth', authRouter);
  app.use(contactsRouter);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import contactsRouter from './routers/contacts.js';

export const setupServer = () => {
  const app = express();

  app.use(pino());

  app.use(cors());

  app.use(express.json());

  app.use(contactsRouter);

  app.use((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({
      message: 'An internal server error occurred',
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
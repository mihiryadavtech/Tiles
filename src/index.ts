import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import express, { Request, Response } from 'express';
import { AppDataSource } from './dataBaseConnection';
import { AppError } from './utils/error';
import { indexRouter } from './routes/index.routes';

const app = express();
const Port = (process.env.PORT as string) || 3000;

//Port Connection

const main = async () => {
  try {
    //Database Intilaization
    await AppDataSource.initialize();
    // image Show
    app.use('/api/v1/image', express.static('uploads/user'));
    app.use('/api/v1/image', express.static('uploads/company'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Routes

    app.use('/api/v1', indexRouter);

    app.use(
      (error: AppError, req: Request, res: Response) => {
        const status = error.statusCode || 400;
        return res.status(status).json({ Error: error.message });
      }
    );

    app.use('/', (req: Request, res: Response) => {
      res.json('hii There I am here');
    });

    app.listen(Port, () => {
      console.log(`Listening on ${Port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
main();

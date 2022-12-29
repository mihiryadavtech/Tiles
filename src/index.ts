import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import cron from 'node-cron';
import express, { Request, Response, NextFunction, urlencoded } from 'express';
import { AppDataSource } from './dataBaseConnection';
import { mainRouter } from './routes/main.routes';
import { adminRouter } from './routes/admin.routes';
import { subroleRouter } from './routes/subrole.routes';
import { userRouter } from './routes/user.routes';
import { companyRouter } from './routes/company.routes';
import { catalogueRouter } from './routes/catelogue.routes';
import { User } from './entities/User.Entity';
const userRepository = AppDataSource.getRepository(User);

const app = express();
const Port = 2300;

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
    app.use('/api/v1', mainRouter);
    app.use('/api/v1', adminRouter);
    app.use('/api/v1', subroleRouter);
    app.use('/api/v1', userRouter);
    app.use('/api/v1', companyRouter);
    app.use('/api/v1', catalogueRouter);

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

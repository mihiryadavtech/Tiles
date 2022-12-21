import 'reflect-metadata';
import express, { Request, Response, urlencoded } from 'express';
import { AppDataSource } from './dataBaseConnection';
import { mainRouter } from './routes/main.routes';
import { adminRouter } from './routes/admin.routes';
import { subroleRouter } from './routes/subrole.routes';
import { userRouter } from './routes/user.routes';
import { companyRouter } from './routes/company.routes';
import { catalogueRouter } from './routes/catelogue.routes';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
const Port = 2300;

const main = async () => {
  try {
    //Database Intilaization
    await AppDataSource.initialize();

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

    //Port Connection
    app.listen(Port, () => {
      console.log(`Listening on ${Port}`);
    });
  } catch (error) {
    console.log(error);
  }
};
main();

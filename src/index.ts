import 'reflect-metadata';
import express, { Request, Response, urlencoded } from 'express';
import { AppDataSource } from './dataBaseConnection';
import { mainRouter } from './routes/main.routes';
const app = express();
const Port = 2300;

const main = async () => {
  try {
    //Database Intilaization
    await AppDataSource.initialize();
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use('/api/v1', mainRouter);

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

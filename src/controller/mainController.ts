import { Request, Response } from 'express';

const getAll = (req: Request, res: Response) => {
  res.status(200).json('hii there i am controller');
};
export { getAll };

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../exceptions/errorException';
const validation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = errors?.array({ onlyFirstError: true }).map((err) => {
       return err?.msg;
    });
    console.log('......', error);
   return new AppError('hiiii', 500);
  }
  return next();
};

export { validation };

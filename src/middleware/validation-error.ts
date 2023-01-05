import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { AppError } from '../exceptions/errorException';
const validation = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('===+++++',errors)
    const error = errors?.array({ onlyFirstError: true }).map((err) => {
      return err?.msg;
    });
    return next(new AppError(error[0], 500));
  }
  return next();
};

export { validation };

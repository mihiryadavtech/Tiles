import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../exceptions/errorException';

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authenticationHeader = req?.headers?.['authorization'];
    const token = authenticationHeader && authenticationHeader?.split(' ')?.[1];
    if (!token) {
      return next(new AppError('User is unauthorized', 401));
    }
    const user = jwt.verify(token, process.env.TOKEN_KEY as string);
    req.app.set('user', user);
    return next();
  } catch (error) {
    return next(new AppError('Error due to Jwt verification', 500));
  }
};
export { authenticateToken };

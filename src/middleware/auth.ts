import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const errorFunction = (error: any) => {
  const errors = {
    code: 400,
    error: {
      message: error.message,
    },
    message: 'Error due to Jwt verification',
  };
  return errors;
};

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authenticationHeader = req?.headers?.['authorization'];
    const token = authenticationHeader && authenticationHeader?.split(' ')?.[1];
    if (!token) {
      return res.status(400).json('User is unauthorized');
    }
    const user = jwt.verify(token, process.env.TOKEN_KEY as string);
    req.app.set('user', user);
    return next();
  } catch (error) {
    return res.status(400).json(errorFunction(error));
  }
};
export = authenticateToken;

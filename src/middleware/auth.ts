import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('>>>>>>>>>>>', 'Inside authtoken');
    const authenticationHeader = req?.headers?.['authorization'];
    const token = authenticationHeader && authenticationHeader?.split(' ')?.[1];
    if (!token) {
      return res.status(400).json('User is unauthorized');
    }
    const user = jwt.verify(token, process.env.TOKEN_KEY as string);
    req.app.set('user', user);
    console.log(req.app.get('user'));
    return next();
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: error.message });
  }
};
export = authenticateToken;

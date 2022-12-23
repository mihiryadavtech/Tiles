import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import authenticateToken from '../middleware/auth';
import {
  createAdmin,
  getAllAdmin,
  loginAdmin,
} from '../controller/admin.controller';

const router = Router();
router.get('/admin', authenticateToken, getAllAdmin);
router.post(
  '/admin/signup',
  [
    body('name').isLength({ min: 3 }).trim().withMessage('Enter proper Name'),
    body('email').isEmail().toLowerCase().withMessage('Enter proper Email'),
    body('password').isLength({ min: 8 }).withMessage('Enter proper Password'),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorArray: string[] = [];
      errors?.array().forEach((element) => {
        errorArray.push(element?.msg);
      });

      console.log(errorArray);
      return res.status(400).json({ Errors: errorArray });
    }
    return next();
  },
  createAdmin
);
router.post(
  '/admin/login',
  [
    body('email').isEmail().toLowerCase().withMessage('Enter proper Email'),
    body('password').isLength({ min: 8 }).withMessage('Enter proper Password'),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const errorArray: string[] = [];
      errors?.array().forEach((element) => {
        errorArray.push(element?.msg);
      });

      console.log(errorArray);
      return res.status(400).json({ Errors: errorArray });
    }
    return next();
  },
  loginAdmin
);

export { router as adminRouter };

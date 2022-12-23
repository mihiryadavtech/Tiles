import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { createSubrole, getAllSubrole } from '../controller/subrole.controller';
import authenticateToken from '../middleware/auth';

const router = Router();
router.get('/subrole', authenticateToken, getAllSubrole);
router.post(
  '/subrole',
  authenticateToken,
  [
    body('name')
      .isLength({ min: 3 })
      .trim()
      .withMessage('Enter proper value for Name'),
    body('slug')
      .isLength({ min: 3 })
      .trim()
      .withMessage('Enter proper value for slug'),
    body('disabled')
      .isBoolean()
      .withMessage('Enter proper value for isDisabled'),
    body('isDeletable')
      .isBoolean()
      .withMessage('Enter proper value for isDeletable'),
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
  createSubrole
);
export { router as subroleRouter };

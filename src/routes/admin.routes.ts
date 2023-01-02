import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import authenticateToken from '../middleware/auth';
import {
  adminDeleteUser,
  adminRegisterUser,
  adminUpdateUser,
  approveCatalogue,
  createAdmin,
  getAllAdmin,
  loginAdmin,
} from '../controller/admin.controller';

const router = Router();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/user');
  },
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
  
});
const upload = multer({ storage: storage });

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
      return res.status(400).json({ Message: errors?.array() });
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
      return res.status(400).json({ Message: errors?.array() });
    }
    return next();
  },
  loginAdmin
);

router.patch('/admin/approve', authenticateToken, approveCatalogue);
router.delete('/admin/user', authenticateToken, adminDeleteUser);
router.post(
  '/admin/user',
  authenticateToken,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'verificationDoc', maxCount: 2 },
    { name: 'visitingCard', maxCount: 1 },
  ]),
  adminRegisterUser
);
router.patch(
  '/admin/user',
  authenticateToken,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'verificationDoc', maxCount: 2 },
    { name: 'visitingCard', maxCount: 1 },
  ]),
  adminUpdateUser
);

export { router as adminRouter };

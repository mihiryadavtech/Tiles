import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { authenticateToken } from '../middleware/auth';
import {
  adminDeleteUser,
  adminRegisterUser,
  adminUpdateUser,
  approveCatalogue,
  createAdmin,
  getAllAdmin,
  loginAdmin,
} from '../controller/admin.controller';
import { validation } from '../middleware/validation-error';
import { adminLogin, adminRegister } from '../validations/admin.validation';

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

router.get('/', authenticateToken, getAllAdmin);
router.post('/signup', adminRegister, validation, createAdmin);
router.post('/login', adminLogin, validation, loginAdmin);

router.patch('/approve', authenticateToken, approveCatalogue);
router.delete('/user', authenticateToken, adminDeleteUser);
router.post(
  '/user',
  authenticateToken,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'verificationDoc', maxCount: 2 },
    { name: 'visitingCard', maxCount: 1 },
  ]),
  adminRegisterUser
);
router.patch(
  '/user',
  authenticateToken,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'verificationDoc', maxCount: 2 },
    { name: 'visitingCard', maxCount: 1 },
  ]),
  adminUpdateUser
);

export { router as adminRouter };

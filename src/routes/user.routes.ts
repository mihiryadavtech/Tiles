import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import {
  getAllUser,
  registerUser,
  updateUser,
  deleteUser,
  loginUser,
  viewCatalog,
  bookmarkCatalogue,
} from '../controller/user.controller';
import multer from 'multer';
import path from 'path';
import { authenticateToken } from '../middleware/auth';
import { userRegister } from '../validations/user.validation';
import { validation } from '../middleware/validation-error';

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

router.post(
  '/signup',
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'verificationDoc', maxCount: 2 },
    { name: 'visitingCard', maxCount: 1 },
  ]),
  userRegister,
  validation,
  registerUser
);

router.post('/login', loginUser);
router.get('/', authenticateToken, getAllUser);

router.patch(
  '/',
  authenticateToken,
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'verificationDoc', maxCount: 2 },
    { name: 'visitingCard', maxCount: 1 },
  ]),
  updateUser
);
router.delete('/', authenticateToken, deleteUser);
router.get('/view', authenticateToken, viewCatalog);
router.post('/bookmark', authenticateToken, bookmarkCatalogue);

//
//
//
//

export { router as userRouter };

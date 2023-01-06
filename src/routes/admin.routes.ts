import { Router } from 'express';
import { userRegister } from '../validations/user.validation';
import {
  adminDeleteUser,
  adminRegisterUser,
  adminUpdateUser,
  approveCatalogue,
  createAdmin,
  getAllAdmin,
  loginAdmin,
} from '../controller/admin.controller';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/fileUpload';
import { validation } from '../middleware/validation-error';
import { adminLogin, adminRegister } from '../validations/admin.validation';
const router = Router();

const uploadFiles = upload('Company', 5000000, [
  ['application/pdf'],
  ['image/jpeg', 'image/png', 'image/jpg'],
]).fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'verificationDoc', maxCount: 2 },
  { name: 'visitingCard', maxCount: 1 },
]);

router.get('/', authenticateToken, getAllAdmin);
router.post('/signup', adminRegister, validation, createAdmin);
router.post('/login', adminLogin, validation, loginAdmin);

router.patch('/approve', authenticateToken, approveCatalogue);
router.delete('/user', authenticateToken, adminDeleteUser);
router.post(
  '/user',
  authenticateToken,
  uploadFiles,
  userRegister,
  validation,
  adminRegisterUser
);
router.patch(
  '/user',
  authenticateToken,
  uploadFiles,
  userRegister,
  validation,
  adminUpdateUser
);

export { router as adminRouter };

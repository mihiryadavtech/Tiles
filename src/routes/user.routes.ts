import { Router } from 'express';
import {
  bookmarkCatalogue,
  deleteUser,
  getAllUser,
  loginUser,
  registerUser,
  updateUser,
  viewCatalog
} from '../controller/user.controller';
import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/fileUpload';
import { validation } from '../middleware/validation-error';
import { userRegister } from '../validations/user.validation';

const router = Router();

const uploadFiles = upload('Company', 5000000, [
  ['application/pdf'],
  ['image/jpeg', 'image/png', 'image/jpg'],
]).fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'verificationDoc', maxCount: 2 },
  { name: 'visitingCard', maxCount: 1 },
]);

router.post('/signup', uploadFiles, userRegister, validation, registerUser);

router.post('/login', loginUser);
router.get('/', authenticateToken, getAllUser);

router.patch(
  '/',
  authenticateToken,
  uploadFiles,
  userRegister,
  validation,
  updateUser
);
router.delete('/', authenticateToken, deleteUser);
router.get('/view', authenticateToken, viewCatalog);
router.post('/bookmark', authenticateToken, bookmarkCatalogue);

export { router as userRouter };


import { Router } from 'express';
import {
  getAllUser,
  registerUser,
  updateUser,
  deleteUser,
  userCreateCatalogue,
  userDeleteCatalogue,
  userUpdateCatalogue,
} from '../controller/user.controller';
import multer from 'multer';
import path from 'path';
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images');
  },
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

const router = Router();
router.get('/user', getAllUser);
router.post(
  '/user',
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'verificationDoc', maxCount: 1 },
    { name: 'visitingCard', maxCount: 1 },
  ]),
  registerUser
);

router.patch(
  '/user',
  upload.fields([
    { name: 'profilePhoto', maxCount: 1 },
    { name: 'verificationDoc', maxCount: 1 },
    { name: 'visitingCard', maxCount: 1 },
  ]),
  updateUser
);
router.delete('/user', deleteUser);

router.post(
  '/user/catalogue',
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'previewImage', maxCount: 1 },
  ]),
  userCreateCatalogue
);

router.patch(
  '/user/catalogue',
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'previewImage', maxCount: 1 },
  ]),
  userUpdateCatalogue
);
router.delete('/user/catalogue', userDeleteCatalogue);
export { router as userRouter };

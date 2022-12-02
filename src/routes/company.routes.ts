import { Router } from 'express';
import {
  companyCreateCatalogue,
  companyDeleteCatalogue,
  companyUpdateCatalogue,
  createCompany,
  deletecompany,
} from '../controller/company.controller';

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
// router.get('/user', getAllUser);
router.post(
  '/company',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'cta', maxCount: 1 },
  ]),
  createCompany
);

// router.patch(
//   '/user',
//   upload.fields([
//     { name: 'profilePhoto', maxCount: 1 },
//     { name: 'verificationDoc', maxCount: 1 },
//     { name: 'visitingCard', maxCount: 1 },
//   ]),
//   updateUser
// );
router.delete('/company', deletecompany);

router.post(
  '/company/catalogue',
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'previewImage', maxCount: 1 },
  ]),
  companyCreateCatalogue
);

router.patch(
  '/company/catalogue',
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'previewImage', maxCount: 1 },
  ]),
  companyUpdateCatalogue
);
router.delete('/company/catalogue', companyDeleteCatalogue);

export { router as companyRouter };

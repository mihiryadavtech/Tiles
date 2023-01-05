import { Router } from 'express';

import {
  deleteCompany, getAllCompany, loginCompany, registerCompany, updateCompany
} from '../controller/company.controller';

import multer from 'multer';
import path from 'path';
import { authenticateToken } from '../middleware/auth';
import { validation } from '../middleware/validation-error';
import {
  companyLogin,
  companyRegister
} from '../validations/company.validation';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/company');
  },
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({
  storage: storage,
});

const router = Router();
router.post(
  '/signup',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'cta', maxCount: 2 },
  ]),
  companyRegister,
  validation,
  registerCompany
);

router.post('/login', companyLogin, validation, loginCompany);
router.get('/', authenticateToken, getAllCompany);
router.patch(
  '/',
  authenticateToken,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'cta', maxCount: 1 },
  ]),
  updateCompany
);
// delete
router.delete('/', authenticateToken, deleteCompany);

export { router as companyRouter };


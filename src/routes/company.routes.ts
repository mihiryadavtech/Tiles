import { Router } from 'express';
import { upload } from '../middleware/fileUpload';

import {
  deleteCompany,
  getAllCompany,
  loginCompany,
  registerCompany,
  updateCompany
} from '../controller/company.controller';

import { authenticateToken } from '../middleware/auth';
import { validation } from '../middleware/validation-error';
import {
  companyLogin,
  companyRegister
} from '../validations/company.validation';

const uploadFiles = upload('Company', 5000000, [
  ['application/pdf'],
  ['image/jpeg', 'image/png', 'image/jpg'],
]).fields([
  { name: 'logo', maxCount: 1 },
  { name: 'cta', maxCount: 2 },
]);

const router = Router();
router.post(
  '/signup',
  uploadFiles,
  companyRegister,
  validation,
  registerCompany
);

router.post('/login', companyLogin, validation, loginCompany);
router.get('/', authenticateToken, getAllCompany);
router.patch(
  '/',
  authenticateToken,
  uploadFiles,
  companyRegister,
  validation,
  updateCompany
);
// delete
router.delete('/', authenticateToken, deleteCompany);

export { router as companyRouter };


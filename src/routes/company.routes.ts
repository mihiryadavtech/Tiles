import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

import {
  companyCreateCatalogue,
  companyDeleteCatalogue,
  companyUpdateCatalogue,
  registerCompany,
  deleteCompany,
  loginCompany,
  getAllCompany,
  updateCompany,
} from '../controller/company.controller';

import authenticateToken from '../middleware/auth';
import multer from 'multer';
import path from 'path';

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
const upload = multer({ storage: storage });

const router = Router();
router.post(
  '/company/signup',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'cta', maxCount: 2 },
  ]),
  [
    body('logo', 'select an Image '),
    body('cta', 'select an Image '),
    body('name').isLength({ min: 3 }).withMessage('Enter your Name'),
    body('mobile')
      .isLength({ min: 10, max: 10 })
      .withMessage('Enter the proper Number'),
    body('email').isEmail().toLowerCase().withMessage('Enter proper Email'),
    body('password').isLength({ min: 8 }).withMessage('Enter proper Password'),
    body('website', 'Enter the website Link'),
    body('address')
      .isLength({ min: 50, max: 200 })
      .withMessage('Enter proper Address'),
    body('latitude')
      .isFloat({ min: 1 - 90, max: 90 })
      .withMessage('Enter proper Latitude'),
    body('longitude')
      .isFloat({ min: -180, max: 180 })
      .withMessage('Enter proper Longitude'),
    body('sponsored')
      .toLowerCase()
      .isBoolean()
      .withMessage('Enter proper Input for Sponsored'),
    body('verified')
      .toLowerCase()
      .isBoolean()
      .withMessage('Enter proper Input for Verified'),
    body('disabled')
      .toLowerCase()
      .isBoolean()
      .withMessage('Enter proper Input for Disabled'),
    body('subrole').notEmpty().withMessage('Enter proper Input for subrole'),
    body('description')
      .isLength({ min: 50, max: 200 })
      .withMessage('Enter proper Description'),
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
  registerCompany
);

router.post('/company/login', loginCompany);
router.get('/company', authenticateToken, getAllCompany);
router.patch(
  '/company',
  authenticateToken,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'cta', maxCount: 1 },
  ]),
  updateCompany
);
router.delete('/company', authenticateToken, deleteCompany);

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

import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

import {
  companyCreateCatalogue,
  companyDeleteCatalogue,
  companyUpdateCatalogue,
  registerCompany,
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
router.post(
  '/company',
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'cta', maxCount: 1 },
  ]),
  [
    body('logo', 'select an Image '),
    body('name').isLength({ min: 3 }).withMessage('Enter your Name '),

    body('mobile')
      .isLength({ min: 10, max: 10 })
      .withMessage('Enter the proper Number'),
    body('email').isEmail().toLowerCase().withMessage('Enter proper Email'),
    body('password').isLength({ min: 8 }).withMessage('Enter proper Password'),
    body('website', 'enter the website link'),
    body('address')
      .isLength({ min: 20, max: 200 })
      .withMessage('Enter proper Address'),
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

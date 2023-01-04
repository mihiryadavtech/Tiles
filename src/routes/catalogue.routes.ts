import { Router, Request, Response, NextFunction } from 'express';
import { check, body, validationResult } from 'express-validator';

import {
  createCatalogue,
  cataloguePrivate,
  updateCatalogue,
  getAllCatalogue,
  deleteCatalogue,
  privateCataloguePermission,
} from '../controller/catalogue.controller';

import multer from 'multer';
import path from 'path';
import {authenticateToken} from '../middleware/auth';
import { AppError } from '../utils/error';

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/catalogue');
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
  fileFilter(req, file, callback) {
    if (file.fieldname === 'pdf') {
      if (file.mimetype === 'application/pdf') {
        callback(null, true);
      } else {
        return callback(new AppError('Only pdf format allowed!', 400));
      }
    } else if (file.fieldname === 'previewImage') {
      if (
        file.mimetype == 'image/png' ||
        file.mimetype == 'image/jpeg' ||
        file.mimetype == 'image/jpg'
      ) {
        callback(null, true);
      } else {
        callback(new AppError('Only image format allowed!', 400));
      }
    }
  },
});

router.post(
  '/',
  authenticateToken,
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'previewImage', maxCount: 1 },
  ]),
  [
    body('name').isLength({ min: 3 }).withMessage('Enter your Name'),
    body('description', 'Enter proper description '),
    body('isPrivate').isBoolean().withMessage('Enter the value for private'),
  ],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ Message: errors?.array() });
    }

    return next();
  },
  createCatalogue
);
router.patch(
  '/',
  authenticateToken,
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'previewImage', maxCount: 1 },
  ]),
  updateCatalogue
);
router.get('/', authenticateToken, getAllCatalogue);
router.delete('/', authenticateToken, deleteCatalogue);
router.patch('/private', cataloguePrivate);
router.post(
  '/permission',
  authenticateToken,
  privateCataloguePermission
);

export { router as catalogueRouter };

import { Router } from 'express';

import {
  cataloguePrivate, createCatalogue, deleteCatalogue, getAllCatalogue, privateCataloguePermission, updateCatalogue
} from '../controller/catalogue.controller';

import multer from 'multer';
import path from 'path';
import { AppError } from '../exceptions/errorException';
import { authenticateToken } from '../middleware/auth';
import { validation } from '../middleware/validation-error';
import { createCatalogueValidation } from '../validations/catalogue.validation';

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
  createCatalogueValidation,
  validation,
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
router.post('/permission', authenticateToken, privateCataloguePermission);

export { router as catalogueRouter };


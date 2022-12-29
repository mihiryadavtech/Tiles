import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

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
import authenticateToken from '../middleware/auth';

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
const upload = multer({ storage: storage });

router.post(
  '/catalogue',
  authenticateToken,
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'previewImage', maxCount: 1 },
  ]),
  createCatalogue
);
router.patch(
  '/catalogue',
  authenticateToken,
  upload.fields([
    { name: 'pdf', maxCount: 1 },
    { name: 'previewImage', maxCount: 1 },
  ]),
  updateCatalogue
);
router.get('/catalogue', authenticateToken, getAllCatalogue);
router.delete('/catalogue', authenticateToken, deleteCatalogue);
router.patch('/catalogue/private', cataloguePrivate);
router.post(
  '/catalogue/permission',
  authenticateToken,
  privateCataloguePermission
);

export { router as catalogueRouter };

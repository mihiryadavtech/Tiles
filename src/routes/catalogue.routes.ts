import { Router } from 'express';

import {
  cataloguePrivate,
  createCatalogue,
  deleteCatalogue,
  getAllCatalogue,
  privateCataloguePermission,
  updateCatalogue
} from '../controller/catalogue.controller';

import { authenticateToken } from '../middleware/auth';
import { upload } from '../middleware/fileUpload';
import { validation } from '../middleware/validation-error';
import { createCatalogueValidation } from '../validations/catalogue.validation';
const router = Router();

// size in bytes 5mb
const uploadFiles = upload('Catalogue', 5000000, [
  ['application/pdf'],
  ['image/jpeg', 'image/png', 'image/jpg'],
]).fields([
  { name: 'pdf', maxCount: 1 },
  { name: 'previewImage', maxCount: 1 },
]);

router.post(
  '/',
  authenticateToken,
  uploadFiles,
  createCatalogueValidation,
  validation,
  createCatalogue
);
router.patch(
  '/',
  authenticateToken,
  uploadFiles,
  createCatalogueValidation,
  validation,
  updateCatalogue
);
router.get('/', authenticateToken, getAllCatalogue);
router.delete('/', authenticateToken, deleteCatalogue);
router.patch('/private', cataloguePrivate);
router.post('/permission', authenticateToken, privateCataloguePermission);

export { router as catalogueRouter };


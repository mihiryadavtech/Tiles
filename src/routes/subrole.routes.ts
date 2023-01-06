import { Router } from 'express';
import { createSubrole, getAllSubrole } from '../controller/subrole.controller';
import { authenticateToken } from '../middleware/auth';
import { validation } from '../middleware/validation-error';
import { createSubroleValidation } from '../validations/subrole.validation';
const router = Router();
router.get('/', authenticateToken, getAllSubrole);
router.post(
  '/',
  authenticateToken,
  createSubroleValidation,
  validation,
  createSubrole
);
export { router as subroleRouter };


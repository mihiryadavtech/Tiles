import { Router } from 'express';
import { createSubrole, getAllSubrole } from '../controller/subrole.controller';

const router = Router();
router.get('/subrole', getAllSubrole);
router.post('/subrole', createSubrole);
export { router as subroleRouter };

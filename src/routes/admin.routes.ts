import { Router } from 'express';
import { createAdmin, getAllAdmin } from '../controller/admin.controller';

const router = Router();
router.get('/admin', getAllAdmin);
router.post('/admin', createAdmin);
export { router as adminRouter };

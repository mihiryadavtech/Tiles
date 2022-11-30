import { Router } from 'express';
import { getAll } from '../controller/mainController';
const router = Router();
router.get('/', getAll);
export { router as mainRouter };

import { Router, Request, Response, NextFunction } from 'express';
import { adminRouter } from './admin.routes';
import { catalogueRouter } from './catalogue.routes';
import { companyRouter } from './company.routes';
import { subroleRouter } from './subrole.routes';
import { userRouter } from './user.routes';
const router = Router();
router.use('/admin', adminRouter);
router.use('/company', companyRouter);
router.use('/user', userRouter);
router.use('/catalogue', catalogueRouter);
router.use('/subrole', subroleRouter);

export { router as indexRouter };

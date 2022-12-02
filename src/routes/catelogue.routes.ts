import { Router } from 'express';

import { companyCataloguePrivate, userCataloguePrivate } from '../controller/catalogue.controller';
const router = Router();

router.patch('/user/catalogue/private', userCataloguePrivate);
router.patch('/company/catalogue/private', companyCataloguePrivate);
router.route('/user/')

export { router as catalogueRouter };

import { Router } from 'express';
import * as ctrl from '../controllers/productController.js';

const router = Router();
router.get('/', ctrl.getProducts);
router.get('/categories', ctrl.getCategories);
router.get('/:id', ctrl.getProduct);

export default router;

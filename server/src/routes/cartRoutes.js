import { Router } from 'express';
import * as ctrl from '../controllers/cartController.js';

const router = Router();
router.get('/', ctrl.getCart);
router.post('/', ctrl.addToCart);
router.put('/:id', ctrl.updateCartItem);
router.delete('/:id', ctrl.removeCartItem);

export default router;

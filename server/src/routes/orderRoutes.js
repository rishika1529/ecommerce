import { Router } from 'express';
import * as ctrl from '../controllers/orderController.js';

const router = Router();
router.post('/', ctrl.placeOrder);
router.get('/:id', ctrl.getOrder);

export default router;

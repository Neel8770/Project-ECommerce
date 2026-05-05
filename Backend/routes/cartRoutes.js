import express from 'express';
import { addToCart , decreaseCartItem, removeItemFromCart,getCartItems} from '../controller/cart.js';
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addToCart);
router.route('/').get(protect, getCartItems);
router.route('/decrease').put(protect, decreaseCartItem);
router.route('/:id').delete(protect, removeItemFromCart);

export default router;
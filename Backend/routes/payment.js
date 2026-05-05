import express from "express";
import { createRazorpayOrder, verifyPayment } from "../controller/payment.js";
import { createOrderSchema } from '../validations/orderValidations.js';
import validate from '../middleware/validate.js';

import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

// WHAT: Endpoint to start payment. 
// WHY: Frontend calls this when the user clicks "Proceed to Payment".
router.post("/create-order", protect,validate(createOrderSchema), createRazorpayOrder);

// WHAT: Endpoint to verify payment.
// WHY: Frontend calls this AFTER the Razorpay popup closes with a success message.
router.post("/verify", protect, verifyPayment);

export default router;
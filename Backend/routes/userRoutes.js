import express from "express";
import { authUser, registerUser, deleteUser, updateUser, sendOTP } from "../controller/user.js";
import { registerSchema, loginSchema } from "../validations/uservalidations.js";
import { protect } from "../middleware/authMiddleware.js"; 
import validate from "../middleware/validate.js"; 
import Joi from "joi";

const router = express.Router();

const otpValidation = Joi.object({
  email: Joi.string().email().required()
});

router.post("/register", validate(registerSchema), registerUser);

router.post("/login", validate(loginSchema), authUser);

router.post("/send-otp", validate(otpValidation), sendOTP)

router.put("/:id", protect, updateUser);

router.delete("/:id", protect, deleteUser);

export default router;
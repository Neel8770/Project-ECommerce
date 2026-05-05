import express from "express";
import { authUser, registerUser, deleteUser, updateUser } from "../controller/user.js";
import { registerSchema, loginSchema } from "../validations/uservalidations.js";
import { protect } from "../middleware/authMiddleware.js"; 
import validate from "../middleware/validate.js"; 
const router = express.Router();

router.post("/register", validate(registerSchema), registerUser);

router.post("/login", validate(loginSchema), authUser);


router.put("/:id", protect, updateUser);

router.delete("/:id", protect, deleteUser);

export default router;
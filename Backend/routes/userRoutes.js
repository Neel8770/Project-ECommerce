import express from "express";
import { authUser, registerUser,deleteUser,updateUser } from "../controller/user.js";
import { registerSchema,loginSchema } from "../validations/uservalidations.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login",authUser);
router.delete("/:id",deleteUser);
router.put("/:id",updateUser);

export default router;
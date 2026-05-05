import express from "express";
import { getProducts, getProductById,updateProduct,deleteProduct,addProduct} from "../controller/product.js";
import upload from "../middleware/product.js";
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js'; 
import { createProductSchema, updateProductSchema } from '../validations/productValidations.js';

const router = express.Router();

router.get("/",getProducts);
router.get("/:id",getProductById);


router.post("/",protect,upload.single('image'),validate(createProductSchema),addProduct);
router.put("/:id",protect,upload.single('image'),validate(updateProductSchema),updateProduct);
router.delete("/:id",protect,deleteProduct);

export default router;
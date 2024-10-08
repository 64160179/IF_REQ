import express from "express";
import {
    getProducts,
    getProductById,
    getProductToDetail,
    createProduct,
    updateProduct,
    updateProductVisibility,
    deleteProduct
} from "../controllers/ProductController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/products', verifyUser, getProducts);
router.get('/products/:id', verifyUser, getProductById);
router.get('/products/detail/:id', verifyUser, adminOnly, getProductToDetail);
router.post('/products', verifyUser, adminOnly, createProduct);
router.patch('/products/:id', verifyUser, adminOnly, updateProduct);
router.patch('/products/visibility/:id', verifyUser, adminOnly, updateProductVisibility);
router.delete('/products/:id', verifyUser, adminOnly, deleteProduct);

export default router;
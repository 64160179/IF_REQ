import express from "express";
import { 
    getUserCart, 
    addProductToCart,
    removeProductFromCart
} from '../controllers/CartController.js';
import { verifyUser } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/cart/:userId',verifyUser , getUserCart);
router.post('/cart',verifyUser , addProductToCart);
router.delete('/cart/:cartId',verifyUser , removeProductFromCart);

export default router;

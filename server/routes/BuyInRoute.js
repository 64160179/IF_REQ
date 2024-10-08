import express from "express";
import {
    getBuyIn,
    createBuyIn

} from "../controllers/BuyInController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/buyins', verifyUser, getBuyIn);
router.post('/buyins', verifyUser, createBuyIn);

export default router;
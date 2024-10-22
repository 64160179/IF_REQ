import express from "express";
import {
    getPayOuts,
    getPayOutById,
    createPayOut
} from "../controllers/PayOutController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/payouts', verifyUser , getPayOuts);
router.get('/payouts/:id', verifyUser , getPayOutById);
router.post('/payouts', verifyUser , createPayOut);

export default router;
import express from "express";
import {
    getPayOuts,
    createPayOut
} from "../controllers/PayOutController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/payouts', verifyUser , getPayOuts);
router.post('/payouts', verifyUser , createPayOut);

export default router;
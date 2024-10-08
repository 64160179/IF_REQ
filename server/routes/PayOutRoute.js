import express from "express";
import {
    getPayOuts,

} from "../controllers/PayOutController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/payouts', verifyUser , getPayOuts);

export default router;
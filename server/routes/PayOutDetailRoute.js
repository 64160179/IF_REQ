import express from "express";
import {
    getPayOutDetails,
} from "../controllers/PayOutDetailController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/payoutdetails', verifyUser , getPayOutDetails);

export default router;

import express from "express";
import {
    getPayOutDetailsByIdToConfirm,
    getPayOutDetailByIdToSummary,
    approvePayOutDetails
} from "../controllers/PayOutDetailController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/payoutdetails/:payoutId', verifyUser , getPayOutDetailsByIdToConfirm);
router.get('/payout/details', verifyUser , getPayOutDetailByIdToSummary);
router.patch('/payout/approve', verifyUser , approvePayOutDetails);

export default router;

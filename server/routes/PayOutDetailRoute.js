import express from "express";
import {
    getPayOutDetailsByIdToConfirm,
    getPayOutDetailByIdToSummary
} from "../controllers/PayOutDetailController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";
const router = express.Router();

router.get('/payoutdetails/:id', verifyUser , getPayOutDetailsByIdToConfirm);
router.get('/payout/details', verifyUser , getPayOutDetailByIdToSummary);

export default router;

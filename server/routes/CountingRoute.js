import express from "express";
import {
    getCountingUnit,
    getCountingUnitToShow,
    getCountingUnitById,
    createCountingUnit,
    updateCountingUnit,
    deleteCountingUnit
} from "../controllers/CountingUnitController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/countingUnits', verifyUser, adminOnly, getCountingUnit);
router.get('/countingUnits/show', verifyUser,  getCountingUnitToShow);
router.get('/countingUnits/:id', verifyUser, adminOnly,  getCountingUnitById);
router.post('/countingUnits', verifyUser, adminOnly, createCountingUnit);
router.patch('/countingUnits/:id', verifyUser, adminOnly,  updateCountingUnit);
router.delete('/countingUnits/:id', verifyUser, adminOnly, deleteCountingUnit);

export default router;
import express from "express";
import {
    getLocation,
    getLocationById,
    createLocation,
    updateLocation,
    deleteLocation
} from "../controllers/LocationController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/locations', verifyUser, adminOnly, getLocation);
router.get('/locations/:id', verifyUser, adminOnly, getLocationById);
router.post('/locations', verifyUser, adminOnly,  createLocation);
router.patch('/locations/:id', verifyUser, adminOnly, updateLocation);
router.delete('/locations/:id', verifyUser, adminOnly, deleteLocation);

export default router;
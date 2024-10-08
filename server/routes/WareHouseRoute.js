import express from "express";
import {
    getWareHouses,

} from "../controllers/WareHouseController.js";

const router = express.Router();

router.get('/warehouses', getWareHouses);

export default router;
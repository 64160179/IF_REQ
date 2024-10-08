import express from "express";
import {
    getUsers,
    getUserById,
    getMeById,
    createUser,
    updateUser,
    editProfile,
    deleteUser
} from "../controllers/UserController.js";
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', verifyUser, adminOnly, getUsers);
router.get('/users/:id', verifyUser, adminOnly, getUserById);
router.post('/users', createUser);
router.patch('/users/:id', verifyUser, adminOnly, updateUser);
router.delete('/users/:id', verifyUser, adminOnly, deleteUser);
router.get('/getme/:id', verifyUser, getMeById);
router.patch('/editprofile/:id', verifyUser, editProfile);

export default router;
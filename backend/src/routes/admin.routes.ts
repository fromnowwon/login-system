import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { checkAdmin } from "../middlewares/checkAdmin";
import {
  getAllUsers,
  updateUserByAdmin,
  deleteUser,
} from "../controllers/admin.controller";

const router = express.Router();

router.use(authMiddleware);
router.use(checkAdmin);

router.get("/users", getAllUsers);
router.put("/users/:id", updateUserByAdmin);
router.delete("/users/:id", deleteUser);

export default router;

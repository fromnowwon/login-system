import express from "express";
import { getUserProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// 내 정보 조회
router.get("/", authMiddleware, getUserProfile);

export default router;

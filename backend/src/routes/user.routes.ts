import express from "express";
import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// 내 정보 조회
router.get("/", authMiddleware, getUserProfile);

// 내 정보 수정
router.put("/", authMiddleware, updateUserProfile);

export default router;

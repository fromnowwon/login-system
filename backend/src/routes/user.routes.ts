import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUser,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// 내 정보 조회
router.get("/", authMiddleware, getUserProfile);

// 내 정보 수정
router.put("/", authMiddleware, updateUserProfile);

// 사용자 삭제
router.delete("/", authMiddleware, deleteUser);

export default router;

import express from "express";
import {
  getUserProfile,
  updateUserProfile,
  deleteUser,
  uploadProfileImage,
  deleteProfileImage,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// 내 정보 조회
router.get("/", authMiddleware, getUserProfile);

// 내 정보 수정
router.put("/", authMiddleware, updateUserProfile);

// 프로필 이미지 업로드
router.post("/profile-image", authMiddleware, uploadProfileImage);

// 프로필 이미지 삭제
router.delete("/profile-image", authMiddleware, deleteProfileImage);

// 사용자 삭제
router.delete("/", authMiddleware, deleteUser);

export default router;

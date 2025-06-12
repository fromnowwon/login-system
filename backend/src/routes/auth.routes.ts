// 요청이 들어오는 경로와 해당 요청을 처리할 컨트롤러를 정의
import express from "express";
import { loginUser, registerUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;

// URL과 controller 함수(로직)를 연결
import express from "express";
import { registerUser } from "../controllers/auth.controller";

const router = express.Router();

router.post("/register", registerUser);

export default router;

// 요청이 들어오는 경로와 해당 요청을 처리할 컨트롤러를 정의
import express from "express";
import {
  googleOAuthCallback,
  loginUser,
  registerUser,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = express.Router();

// 회원가입
router.post("/register", registerUser);

// 로그인
router.post("/login", loginUser);

// 인증된 사용자 정보 조회
router.get("/certificate", authMiddleware, (req, res) => {
  // 미들웨어는 void or Promise<void>를 반환해야 함, 흐름은 next()로 넘겨야 함!
  // 미들웨어 인증이 성공해야 이 라우터가 실행됨

  // req.user는 authMiddleware에서 설정한 사용자 정보
  const user = req.user!; // 미들웨어에서 검증했기 때문에 user가 존재함을 보장

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
  });
});

// 구글 OAuth 콜백
router.get("/google/callback", googleOAuthCallback);

export default router;

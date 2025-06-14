import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "인증 토큰이 필요합니다." });
    return;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    return;
  }

  // 사용자 정보가 있으면 req.user 생성 후 담아서 다음 미들웨어나 라우터로 전달
  req.user = decoded;
  next();
}

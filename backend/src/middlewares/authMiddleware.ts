import { Request, Response, NextFunction } from "express";
import { RowDataPacket } from "mysql2";
import { verifyToken } from "../utils/jwt";
import pool from "../db";

interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  role: string;
}

export async function authMiddleware(
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

  if (!decoded || !decoded.id) {
    res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    return;
  }

  // DB에서 최신 정보 다시 가져오기
  try {
    const [rows] = await pool.query<UserRow[]>(
      "SELECT id, name, email, role FROM users WHERE id = ?",
      [decoded.id]
    );

    if (Array.isArray(rows) && rows.length > 0) {
      req.user = rows[0];
      console.log("authMiddleware - req.user:", req.user);
      next();
    } else {
      res.status(401).json({ message: "사용자를 찾을 수 없습니다." });
    }
  } catch (error) {
    next(error);
  }
}

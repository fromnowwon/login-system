// 클라이언트에서 요청한 로직을 처리하는 역할
import { NextFunction, Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import pool from "../db";

export const registerUser: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "모든 필드를 입력해주세요." });
    return;
  }

  try {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if ((existing as any[]).length > 0) {
      res.status(409).json({ message: "이미 가입된 이메일입니다." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, hashedPassword]
    );

    res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    console.error("회원가입 오류", error);

    res
      .status(500)
      .json({ message: "서버 오류가 발생했습니다. 나중에 다시 시도해주세요." });

    next(error);
  }
};

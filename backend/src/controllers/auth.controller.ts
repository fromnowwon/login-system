// 클라이언트에서 요청한 로직을 처리하는 역할
import { Request, Response, RequestHandler } from "express";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import pool from "../db";
import { generateToken } from "../utils/jwt";

export const registerUser: RequestHandler = async (
  req: Request,
  res: Response
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

    // TypeScript에서 pool.query의 결과 타입은 기본적으로 any로 반환
    // RowDataPacket[]로 타입 단언을 통해 명시적으로 지정하여 DB에서 가져온 데이터 행(Row) 명시
    if ((existing as RowDataPacket[]).length > 0) {
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
  }
};

export const loginUser: RequestHandler = async (
  req: Request,
  res: Response
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "이메일과 비밀번호를 입력해주세요." });
    return;
  }

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
      email,
    ]);

    const user = (rows as RowDataPacket[])[0];

    if (!user) {
      res.status(404).json({ message: "존재하지 않는 이메일입니다." });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
      return;
    }

    // 토큰 생성
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    res.status(200).json({
      message: "로그인 성공",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("로그인 오류", error);
    res
      .status(500)
      .json({ message: "서버 오류가 발생했습니다. 나중에 다시 시도해주세요." });
  }
};

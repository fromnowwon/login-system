// 클라이언트에서 요청한 로직을 처리하는 역할
import { Request, Response, RequestHandler, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db";
import { generateToken } from "../utils/jwt";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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

// 구글 OAuth 콜백 처리
export const googleOAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { code } = req.body;

    if (!code) {
      res.status(400).json({ message: "Google code가 필요합니다." });
      return;
    }

    // code 로 access_token, id_token 교환
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();

    if (!tokenData.id_token) {
      res.status(400).json({ message: "인증 처리 중 오류가 발생했습니다." });
      return;
    }

    // id_token 검증
    const ticket = await client.verifyIdToken({
      idToken: tokenData.id_token,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      res.status(400).json({ message: "유효하지 않은 ID 토큰 정보입니다." });
      return;
    }

    const { sub: googleId, email, name, picture } = payload;

    // 사용자 조회/생성
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE google_id = ? OR email = ?",
      [googleId, email]
    );
    let user = (rows as RowDataPacket[])[0];

    if (!user) {
      const [result] = await pool.query<ResultSetHeader>(
        "INSERT INTO users (name, email, profile_image, google_id) VALUES (?, ?, ?, ?)",
        [name, email, picture, googleId]
      );
      const insertedId = result.insertId;

      const [newUserRows] = await pool.query<RowDataPacket[]>(
        "SELECT * FROM users WHERE id = ?",
        [insertedId]
      );
      user = newUserRows[0];
    }

    // JWT 발급 후 응답
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profile_image: user.profile_image,
      },
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

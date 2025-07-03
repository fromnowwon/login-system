// 클라이언트에서 요청한 로직을 처리하는 역할
import { Request, Response, RequestHandler, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";

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

    if (!user.password) {
      res.status(400).json({
        message:
          "이 계정은 비밀번호 로그인으로 접근할 수 없습니다. 소셜 로그인을 이용해주세요.",
      });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });
      return;
    }

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    // 토큰 생성
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // HTTPS 환경에서만 전달
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
    });

    res.status(200).json({
      message: "로그인 성공",
      accessToken,
      user: payload,
    });
  } catch (error) {
    console.error("로그인 오류", error);
    res
      .status(500)
      .json({ message: "서버 오류가 발생했습니다. 나중에 다시 시도해주세요." });
  }
};

// Access Token 재발급 요청
export const refreshTokenHandler: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies.refreshToken; // 쿠키에서 읽음

  if (!refreshToken) {
    res.status(401).json({ message: "Refresh Token이 없습니다." });
    return;
  }

  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    res.status(403).json({ message: "유효하지 않은 Refresh Token입니다." });
    return;
  }

  const newAccessToken = generateAccessToken({
    id: decoded.id,
    email: decoded.email,
    name: decoded.name,
  });

  res.status(200).json({ accessToken: newAccessToken });
};

// 구글 OAuth 콜백 처리
export const googleOAuthCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const code = req.query.code as string | undefined;

    if (!code) {
      res.status(400).json({ message: "Google 인증 코드가 필요합니다." });
      return;
    }

    // 구글에 code를 보내서 토큰 받기
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

    // ID 토큰 검증
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
    // 먼저 google_id로만 찾음
    let [rows] = await pool.query("SELECT * FROM users WHERE google_id = ?", [
      googleId,
    ]);
    let user = (rows as RowDataPacket[])[0];

    if (!user) {
      // google_id 없으면 이메일로 찾음
      [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
      user = (rows as RowDataPacket[])[0];

      if (user) {
        // 이미 이메일로 가입된 유저라면 google_id를 연결해줌
        await pool.query("UPDATE users SET google_id = ? WHERE id = ?", [
          googleId,
          user.id,
        ]);
      } else {
        // 이메일로도 없으면 새로 만듦
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
    }

    // JWT 생성
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    const redirectUrl = `${process.env.CLIENT_URL}/login-success?token=${token}`;
    res.redirect(redirectUrl);
  } catch (error) {
    console.error(error);
    next(error);
  }
};

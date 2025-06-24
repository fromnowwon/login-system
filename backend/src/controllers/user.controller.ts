import { RequestHandler, Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import s3 from "../utils/s3";
import pool from "../db";

// multer로 메모리에 파일 올림
const upload = multer({
  storage: multer.memoryStorage(),
});

// 사용자 프로필 사진 업로드
export const uploadProfileImage: RequestHandler = (req, res) => {
  // multer 실행
  upload.single("profile_image")(req, res, async (err) => {
    if (err) {
      console.error(err);
      return res.status(400).json({ message: "파일 업로드 실패", err });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "파일이 없습니다." });
    }

    const userId = req.user?.id;
    const fileName = `profile/${userId}/${uuidv4()}_${file.originalname}`;

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    try {
      const data = await s3.upload(params).promise();
      await pool.query("UPDATE users SET profile_image = ? WHERE id = ?", [
        data.Location,
        userId,
      ]);
      res.json({ imageUrl: data.Location });
    } catch (error) {
      console.error("S3 Upload Error:", JSON.stringify(error, null, 2));
      res.status(500).json({ message: "업로드 실패", error });
    }
  });
};

// 사용자 프로필 사진 삭제
export const deleteProfileImage: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;

    // DB의 profile_image 필드를 NULL로 업데이트
    await pool.query("UPDATE users SET profile_image = NULL WHERE id = ?", [
      userId,
    ]);

    res.json({ message: "프로필 이미지가 삭제되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "이미지 삭제 실패" });
  }
};

// 사용자 프로필 조회
export const getUserProfile: RequestHandler = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      res.status(401).json({ message: "인증 정보가 없습니다." });
      return;
    }

    // 추가 필드만 DB에서 가져옴
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT profile_image, created_at FROM users WHERE id = ?",
      [user.id]
    );

    if ((rows as RowDataPacket[]).length === 0) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile_image: rows[0].profile_image,
      created_at: rows[0].created_at,
    });
  } catch (error) {
    res.status(500).json({ message: "서버 오류" });
  }
};

// 사용자 프로필 수정
export const updateUserProfile: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { name, email, password } = req.body;

    // 기본 유효성 검사
    if (!name || !email) {
      res.status(400).json({ message: "이름과 이메일은 필수입니다." });
      return;
    }

    // 비밀번호 해싱
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    let query = "UPDATE users SET name = ?, email = ?";
    const params: any[] = [name, email];

    if (hashedPassword) {
      query += ", password = ?";
      params.push(hashedPassword);
    }

    query += " WHERE id = ?";
    params.push(userId);

    // DB에 업데이트
    const [result] = await pool.query<ResultSetHeader>(query, params);

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    // 새 토큰 발급
    const token = jwt.sign(
      { id: userId, name, email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    res.json({
      message: "프로필이 성공적으로 수정되었습니다.",
      token, // 새 토큰 반환!
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류" });
  }
};

// 사용자 삭제
export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;

    const [result] = await pool.query<ResultSetHeader>(
      "DELETE FROM users WHERE id = ?",
      [userId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    res.json({ message: "회원 탈퇴가 완료되었습니다." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
};

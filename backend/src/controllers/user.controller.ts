import { RequestHandler, Request, Response } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
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
    const userId = req.user?.id;
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, email, profile_image, created_at FROM users WHERE id = ?",
      [userId]
    );
    if ((rows as RowDataPacket[]).length === 0) {
      res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
      return;
    }

    res.json(rows[0]);
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

    // 비밀번호가 넘어온 경우, 해싱 후 같이 업데이트
    let query = "UPDATE users SET name = ?, email = ?";
    const params: any[] = [name, email];

    if (password) {
      // bcrypt로 비밀번호 해싱
      const hashedPassword = await bcrypt.hash(password, 10);
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

    res.json({ message: "프로필이 성공적으로 수정되었습니다." });
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

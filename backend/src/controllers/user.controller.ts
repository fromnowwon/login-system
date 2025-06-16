import { RequestHandler } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt";
import pool from "../db";

// 사용자 프로필 조회
export const getUserProfile: RequestHandler = async (req, res) => {
  try {
    const userId = req.user?.id;
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
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

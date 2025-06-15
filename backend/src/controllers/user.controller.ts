import { RequestHandler } from "express";
import { ResultSetHeader, RowDataPacket } from "mysql2";
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
    const { name, email } = req.body;

    // 기본 유효성 검사
    if (!name || !email) {
      res.status(400).json({ message: "이름과 이메일은 필수입니다." });
      return;
    }

    // DB에 업데이트
    const [result] = await pool.query<ResultSetHeader>(
      "UPDATE users SET name = ?, email = ? WHERE id = ?",
      [name, email, userId]
    );
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

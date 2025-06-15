import { RequestHandler } from "express";
import { RowDataPacket } from "mysql2";
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

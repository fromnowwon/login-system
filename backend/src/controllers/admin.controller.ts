import { Request, Response } from "express";
import db from "../db";

// 모든 유저 조회
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query("SELECT id, email, name, role FROM users");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "유저 목록 불러오기 실패", error });
  }
};

// 유저 정보 수정
export const updateUserByAdmin = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { email, name, role } = req.body;

  try {
    await db.query(
      "UPDATE users SET email = ?, name = ?, role = ? WHERE id = ?",
      [email, name, role, id]
    );
    res.json({ message: "유저 정보가 수정되었습니다." });
  } catch (error) {
    res.status(500).json({ message: "유저 수정 실패", error });
  }
};

// 유저 삭제
export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await db.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({ message: "유저가 삭제되었습니다." });
  } catch (error) {
    res.status(500).json({ message: "유저 삭제 실패", error });
  }
};

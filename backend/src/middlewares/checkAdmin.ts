import { Request, Response, NextFunction } from "express";

export const checkAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user = req.user;

  if (user && user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "관리자 권한이 필요합니다." });
  }
};

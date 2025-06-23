import "express";

// Express 기본 Request 타입에는 user가 없어 req.user 타입 에러
// user 객체 타입 명시
declare global {
  namespace Express {
    // 기존 타입 확장
    interface Request {
      user?: {
        id: number;
        email: string;
        name: string;
        role: string;
      };
    }
  }
}

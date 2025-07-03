import jwt, { JwtPayload } from "jsonwebtoken";

interface UserPayload extends JwtPayload {
  id: number;
  email: string;
  name: string;
}

const JWT_SECRET =
  process.env.NODE_ENV === "production"
    ? process.env.JWT_SECRET!
    : process.env.JWT_SECRET || "devSecretKey";

const JWT_REFRESH_SECRET =
  process.env.JWT_REFRESH_SECRET || "devRefreshSecretKey";

// Access Token 발급
export function generateAccessToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "15m",
  });
}

// Refresh Token 발급
export function generateRefreshToken(payload: Pick<UserPayload, "id">): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
}

// Access Token 검증
export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
}

// Refresh Token 검증
export function verifyRefreshToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as UserPayload;
  } catch (error) {
    console.error("Refresh token verification error:", error);
    return null;
  }
}

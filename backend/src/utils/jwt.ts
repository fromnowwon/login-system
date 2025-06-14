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

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
}

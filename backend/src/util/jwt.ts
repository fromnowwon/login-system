import jwt from "jsonwebtoken";

const JWT_SECRET =
  process.env.NODE_ENV === "production"
    ? process.env.JWT_SECRET!
    : process.env.JWT_SECRET || "devSecretKey";

export function generateToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

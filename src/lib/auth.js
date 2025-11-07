import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "default_dev_secret"; 

export function generateToken(user) {
  return jwt.sign({ id: user._id, email: user.email, role: user.role }, SECRET);
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch {
    return null;
  }
}
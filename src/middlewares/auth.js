// app/middlewares/auth.js
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_default_secret";

// Common function to verify token
const verifyToken = async (req) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization token missing");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    return decoded;
  } catch (error) {
    throw new Error("Invalid or expired token", error);
  }
};

// User middleware
export async function userAuthentication(request) {
  const decoded = await verifyToken(request);

  if (decoded.role !== "user" && decoded.role !== "admin") {
    throw new Error("Unauthorized access");
  }
  return decoded;
}

// Admin middleware
export async function adminAuthentication(request) {
  const decoded = await verifyToken(request);
  if (decoded.role !== "admin") {
    throw new Error("Admin access only");
  }
  return decoded;
}

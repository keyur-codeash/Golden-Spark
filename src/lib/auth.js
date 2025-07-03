import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "default_dev_secret"; // Use env in production

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

// import jwt from 'jsonwebtoken';

// const SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use env in prod

// export function signToken(user) {
//   return jwt.sign({ id: user.id, email: user.email }, SECRET, { expiresIn: '1h' });
// }

// export function verifyToken(token) {
//   try {
//     return jwt.verify(token, SECRET);
//   } catch {
//     return null;
//   }
// }

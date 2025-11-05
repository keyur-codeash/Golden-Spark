import { jwtVerify } from "jose";

export async function verifyToken(token) {
  // Must match the key used to sign the token
  const secret = new TextEncoder().encode("Codeash@123");

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return null;
  }
}
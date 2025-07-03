import bcrypt from "bcrypt";

const users = []; // In-memory user store (replace with DB in prod)

export async function createUser({ name, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(),
    name,
    email,
    password: hashedPassword,
  };
  users.push(user);
  return { id: user.id, name: user.name, email: user.email };
}

export async function findUserByEmail(email) {
  return users.find((u) => u.email === email);
}

export async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.password);
}

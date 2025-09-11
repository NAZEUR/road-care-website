import { readJSON, writeJSON, remove } from "./storage";

const USERS_KEY = "rdr_users";
const CURRENT_KEY = "rdr_current_user";

function getUsers() {
  return readJSON(USERS_KEY, []);
}

function saveUsers(list) {
  writeJSON(USERS_KEY, list);
}

function toHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(password) {
  // Web Crypto subtle (browser only)
  const enc = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", enc);
  return toHex(digest);
}

export async function registerUser(name, email, password) {
  const users = getUsers();
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { ok: false, message: "Email sudah terdaftar." };
  }
  const hashed = await hashPassword(password);
  const user = {
    id: `user_${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    password: hashed,
  };
  users.push(user);
  saveUsers(users);
  return { ok: true };
}

export async function loginUser(email, password) {
  const users = getUsers();
  const hashed = await hashPassword(password);
  const user = users.find(
    (u) =>
      u.email.toLowerCase() === email.toLowerCase() && u.password === hashed
  );
  if (!user) return { ok: false, message: "Email atau password salah." };
  writeJSON(CURRENT_KEY, user);
  return { ok: true };
}

export function getCurrentUser() {
  return readJSON(CURRENT_KEY, null);
}

export function logout() {
  remove(CURRENT_KEY);
}

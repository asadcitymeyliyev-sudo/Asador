import express from "express";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET = "supersecret"; // Секрет для JWT

const users = [
  { username: "asadbek", password: "1234" },
  { username: "ali", password: "qwerty" }
];

const sessions = {}; // sessionId -> username

router.post("/", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Неверный логин или пароль" });

  // Создаём cookie-сессию
  const sessionId = uuidv4();
  sessions[sessionId] = username;
  res.cookie("sessionId", sessionId, { httpOnly: true });

  // Создаём JWT (опционально)
  const token = jwt.sign({ username }, SECRET, { expiresIn: "1h" });

  res.json({ success: true, username, token });
});

export function getUsernameFromSession(req) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return null;
  return sessions[sessionId] || null;
}

// Проверка JWT (готово к использованию)
export function getUsernameFromToken(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET);
    return payload.username;
  } catch (e) {
    return null;
  }
}

export default router;

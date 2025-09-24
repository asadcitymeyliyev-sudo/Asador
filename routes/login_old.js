import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

const users = [
  { username: "asadbek", password: "1234" },
  { username: "ali", password: "qwerty" }
];

const sessions = {}; // sessionId -> username

router.post("/", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ message: "Неверный логин или пароль" });

  const sessionId = uuidv4();
  sessions[sessionId] = username;
  res.cookie("sessionId", sessionId, { httpOnly: true });
  res.json({ success: true, username });
});

export function getUsernameFromSession(req) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId) return null;
  return sessions[sessionId] || null;
}

export default router;

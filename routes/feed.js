import express from "express";
import { getUsernameFromSession } from "./login.js";

const router = express.Router();

const allPosts = [
  { username: "asadbek", text: "Привет, это мой первый пост! 🚀", likes: 5, comments: 2 },
  { username: "ali", text: "Тестируем ленту 😎", likes: 3, comments: 1 }
];

router.get("/", (req, res) => {
  const username = getUsernameFromSession(req);
  if (!username) return res.status(401).json({ message: "Не авторизован" });

  const posts = allPosts.filter(p => p.username === username);
  res.json(posts);
});

router.post("/add", (req, res) => {
  const username = getUsernameFromSession(req);
  if (!username) return res.status(401).json({ message: "Не авторизован" });

  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Нет текста" });

  allPosts.push({ username, text, likes: 0, comments: 0 });
  res.json({ success: true });
});

export default router;

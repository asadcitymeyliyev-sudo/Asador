import express from "express";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;
const USERS_FILE = "./users.json";

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(process.cwd(), "public")));

// --- Регистрация ---
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.send("Введите имя и пароль!");

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  }

  if (users.find(u => u.username === username)) {
    return res.send("Пользователь уже существует!");
  }

  users.push({ username, password });
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.send("✅ Успешно зарегистрировано! Можете войти.");
});

// --- Вход ---
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.send("Введите имя и пароль!");

  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE, "utf8"));
  }

  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.send("Неверный логин или пароль!");

  res.send(`✅ Привет, ${username}! Вы успешно вошли.`);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

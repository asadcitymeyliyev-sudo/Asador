// server.js
import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";
import cors from "cors";

const SECRET_KEY = "supersecretkey";
const app = express();
const PORT = process.env.PORT || 3000;

// Подключаем CORS
app.use(cors());

// Подключаем body-parser
app.use(bodyParser.json());

// Статическая папка для HTML/CSS/JS
app.use(express.static("public"));

// Инициализация базы данных SQLite
let SQL;
let db;
initSqlJs().then(SQLLib => {
  SQL = SQLLib;
  const dbFile = path.join("./", "mydb.sqlite");
  if (fs.existsSync(dbFile)) {
    const fileBuffer = fs.readFileSync(dbFile);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, password TEXT)");
    fs.writeFileSync(dbFile, Buffer.from(db.export()));
  }
});

// Сохранение базы
function saveDb() {
  const data = db.export();
  fs.writeFileSync(path.join("./", "mydb.sqlite"), Buffer.from(data));
}

// Регистрация
app.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ error: "Username and password required" });

  const hashed = bcrypt.hashSync(password, 10);

  try {
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashed]);
    saveDb();
    res.json({ message: "User created" });
  } catch (err) {
    res.json({ error: "Username already exists" });
  }
});

// Логин
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.json({ error: "Username and password required" });

  const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
  stmt.bind([username]);
  if (!stmt.step()) return res.json({ error: "User not found" });

  const user = stmt.getAsObject();
  const match = bcrypt.compareSync(password, user.password);
  if (!match) return res.json({ error: "Invalid password" });

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Запуск сервера
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

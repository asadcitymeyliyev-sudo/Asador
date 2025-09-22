import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import initSqlJs from "sql.js";
import fs from "fs";

const SECRET_KEY = "supersecretkey"; // можешь поменять на свой секрет
const app = express();
app.use(bodyParser.json());

// Инициализация SQL.js
const SQL = await initSqlJs();
let db;

// Загружаем базу из файла, если есть
const dbFile = "mydb.sqlite";
if (fs.existsSync(dbFile)) {
  const filebuffer = fs.readFileSync(dbFile);
  db = new SQL.Database(filebuffer);
} else {
  db = new SQL.Database();
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`);
}

// Функция для сохранения базы в файл
function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbFile, buffer);
}

// Регистрация
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  try {
    db.run("INSERT INTO users (username, password) VALUES (?, ?)", [
      username,
      hashed,
    ]);
    saveDB();
    res.json({ message: "User created" });
  } catch (err) {
    res.status(400).json({ error: "Username already exists" });
  }
});

// Логин
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const result = db.exec("SELECT * FROM users WHERE username = ?", [username]);

  if (!result[0] || result[0].values.length === 0) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const user = result[0].values[0];
  const valid = await bcrypt.compare(password, user[2]);

  if (!valid) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user[0], username: user[1] }, SECRET_KEY, {
    expiresIn: "1h",
  });
  res.json({ token });
});

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(3000, () => console.log("Server running on port 3000"));

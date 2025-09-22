import fs from "fs";
import initSqlJs from "sql.js";

const run = async () => {
  // Инициализация SQL.js
  const SQL = await initSqlJs();

  // Проверяем, существует ли файл базы
  const dbFile = "database.sqlite";
  let db;
  if (fs.existsSync(dbFile)) {
    const filebuffer = fs.readFileSync(dbFile);
    db = new SQL.Database(filebuffer);
  } else {
    db = new SQL.Database();
    console.log("Создали новую базу данных");
  }

  // Создаём таблицу (если ещё нет)
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT)");

  // Вставляем пример данных
  db.run("INSERT INTO users (name) VALUES (?)", ["Asadbek"]);

  // Читаем данные
  const result = db.exec("SELECT * FROM users");
  console.log("Пользователи в базе:", JSON.stringify(result, null, 2));

  // Сохраняем обратно в файл
  const data = db.export();
  fs.writeFileSync(dbFile, Buffer.from(data));

  console.log("Готово! База сохранена в", dbFile);
};

run();
const fs = require("fs");
const initSqlJs = require("sql.js");

(async () => {
  const SQL = await initSqlJs();
  const db = new SQL.Database();
  db.run("CREATE TABLE test (id INTEGER PRIMARY KEY, name TEXT);");
  db.run("INSERT INTO test (name) VALUES (?)", ["Asadbek"]);

  const res = db.exec("SELECT * FROM test;");
  console.log(res);

  db.close();
})();

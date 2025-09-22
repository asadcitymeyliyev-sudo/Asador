import express from "express";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import initSqlJs from "sql.js";
import fs from "fs";
import path from "path";

const SECRET_KEY = "supersecretkey"; 
const app = express();

// Подключаем body-parser
app.use(bodyParser.json());

// Добавляем статическую папку для файлов HTML/CSS/JS
app.use(express.static("public"));

// Ниже — остальной код: работа с базой данных, маршруты /register и /login

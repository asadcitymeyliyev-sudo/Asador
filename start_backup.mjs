// start.mjs
import { exec } from "child_process";

// --- 0. Убиваем старый сервер на порту 3000 ---
exec("fuser -k 3000/tcp", (err, stdout, stderr) => {
  if (err) console.log(`[KILL ERROR]: ${err}`);
  else console.log(`[KILL OLD SERVER]: ${stdout || "Done"}`);

  // --- 1. Запуск сервера ---
  const server = exec("node server.js");
  server.stdout.on("data", (data) => console.log(`[SERVER]: ${data}`));
  server.stderr.on("data", (data) => console.error(`[SERVER ERROR]: ${data}`));

  // --- 2. Запуск туннеля ---
  const tunnel = exec("node lt.mjs");
  tunnel.stdout.on("data", (data) => console.log(`[TUNNEL]: ${data}`));
  tunnel.stderr.on("data", (data) => console.error(`[TUNNEL ERROR]: ${data}`));
});




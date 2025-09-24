// service.mjs
import { exec } from "child_process";

// --- Настройки ---
const PORT = 3000;               // Порт твоего сервера
const SUBDOMAIN = "asador123";   // Субдомен для LocalTunnel

// --- Функция запуска сервера ---
function startServer() {
  const server = exec("node server.js");

  server.stdout.on("data", (data) => console.log(`[SERVER]: ${data}`));
  server.stderr.on("data", (data) => {
    console.error(`[SERVER ERROR]: ${data}`);
    console.log("[SERVER]: Перезапускаем через 2 сек...");
    setTimeout(startServer, 2000);
  });

  server.on("exit", (code) => {
    console.log(`[SERVER]: Завершился с кодом ${code}, перезапуск через 2 сек...`);
    setTimeout(startServer, 2000);
  });
}

// --- Функция запуска LocalTunnel ---
function startTunnel() {
  const tunnel = exec(`node lt.mjs --port ${PORT} --subdomain ${SUBDOMAIN}`);

  tunnel.stdout.on("data", (data) => console.log(`[TUNNEL]: ${data}`));
  tunnel.stderr.on("data", (data) => {
    console.error(`[TUNNEL ERROR]: ${data}`);
    console.log("[TUNNEL]: Перезапускаем через 2 сек...");
    setTimeout(startTunnel, 2000);
  });

  tunnel.on("exit", (code) => {
    console.log(`[TUNNEL]: Завершился с кодом ${code}, перезапуск через 2 сек...`);
    setTimeout(startTunnel, 2000);
  });
}

// --- Сначала убиваем старый сервер, если висит ---
exec("pkill -f 'node server.js'", (err, stdout, stderr) => {
  if (err) console.log(`[KILL ERROR]: ${err}`);
  else console.log("[KILL OLD SERVER]: Done");

  // Запуск сервера и туннеля
  startServer();
  startTunnel();
});

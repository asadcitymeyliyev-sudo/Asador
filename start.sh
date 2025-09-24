# вставь код выше и сохрани#!/bin/bash
pkill -f "node autostart.mjs" 2>/dev/null
node ~/myapp/autostart.mjs
#!/data/data/com.termux/files/usr/bin/bash
# start.sh — запуск сервера + LocalTunnel

echo "[START SCRIPT]: Запуск autostart.mjs..."
node ~/myapp/autostart.mjs
#!/bin/bash

# Путь к Node.js проекту
APP_DIR=~/myapp
PORT=3000

cd $APP_DIR

# Убиваем старый сервер и туннель, если есть
pkill -f "node server.js"
pkill -f "node autostart.mjs"

echo "[KILL OLD PROCESSES]: Done"

# Запускаем сервер в фоне
node server.js &
echo "[SERVER]: Запущен на http://localhost:$PORT"

# Запускаем туннель (LocalTunnel)
node autostart.mjs &
echo "[TUNNEL]: Запущен (LocalTunnel)..."

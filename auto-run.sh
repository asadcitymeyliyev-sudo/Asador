#!/data/data/com.termux/files/usr/bin/bash

cd ~/myapp

while true; do
  # Проверяем сервер
  if ! pgrep -f "node server.js" > /dev/null; then
    echo "$(date) - Сервер не запущен, перезапускаем..." >> auto-run.log
    nohup node server.js > server.log 2>&1 &
  fi

  # Проверяем keep-alive
  if ! pgrep -f "node keep-alive.js" > /dev/null; then
    echo "$(date) - Keep-alive не запущен, перезапускаем..." >> auto-run.log
    nohup node keep-alive.js > keep-alive.log 2>&1 &
  fi

  sleep 30
done

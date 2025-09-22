#!/data/data/com.termux/files/usr/bin/bash

# Папка проекта
APP_DIR="$HOME/myapp"

# Порт сервера (замени, если у тебя другой)
PORT=3000

# Получаем локальный IP устройства
IP=$(ip addr show wlan0 | grep 'inet ' | awk '{print $2}' | cut -d/ -f1)

# Запускаем сервер Node.js в фоне
node "$APP_DIR/index.js" &

# Ждём 2 секунды, чтобы сервер успел подняться
sleep 2

# Открываем браузер Android через Termux (am start)
am start -a android.intent.action.VIEW -d "http://$IP:$PORT"

import fetch from "node-fetch";

const URL = "https://asador-1v5v.onrender.com"; // твой Render URL
const INTERVAL = 5 * 60 * 1000; // каждые 5 минут

async function ping() {
  try {
    const res = await fetch(URL);
    console.log(`${new Date().toLocaleTimeString()} - Pinged ${URL} - Status: ${res.status}`);
  } catch (err) {
    console.error(`${new Date().toLocaleTimeString()} - Error pinging ${URL}:`, err.message);
  }
}

// первый запуск сразу
ping();

// дальше каждые INTERVAL
setInterval(ping, INTERVAL);

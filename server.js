require("dotenv").config();

const weatherApiKey = process.env.WEATHER_API_KEY;
const ollamaURL = process.env.OLLAMA_URL;
const ollamaModel = process.env.OLLAMA_MODEL;

const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Servir archivos estáticos (index.html, styles.css, scripts JS, etc.)
app.use(express.static(__dirname));

app.get("/env", (req, res) => {
  res.json({
    WEATHER_API_KEY: process.env.WEATHER_API_KEY,
    OLLAMA_URL: process.env.OLLAMA_URL,
    OLLAMA_MODEL: process.env.OLLAMA_MODEL,
  });
});

// Ruta principal
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

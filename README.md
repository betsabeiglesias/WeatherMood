# WeatherMood 🌦️✨

**WeatherMood** es una aplicación web interactiva que combina información meteorológica en tiempo real con generación de frases motivadoras, basadas en el clima actual de cualquier ubicación seleccionada en el mapa.

---

## 🚀 Tecnologías utilizadas

- **Node.js** (servidor backend con Express)
- **Leaflet.js** (mapas interactivos)
- **Tailwind CSS** (estilos rápidos y responsivos)
- **FontAwesome** (íconos vectoriales)
- **WeatherAPI** (datos de clima en tiempo real)
- **Ollama** (modelo de lenguaje Llama3 o Salamandra para generación de texto)

---

## ⚙️ Requisitos previos

Antes de comenzar asegúrate de tener instalado:

- **Node.js** (versión recomendada 18+)
- **npm** (gestor de paquetes de Node.js)
- **Ollama** instalado y funcionando localmente

  👉 Descarga desde: [https://ollama.com/download](https://ollama.com/download)

- Tener un modelo descargado en Ollama (ej: `hdnh2006/salamandra-7b-instruct` o `llama3`)
- Una API Key válida de [WeatherAPI.com](https://www.weatherapi.com/)

---

## 🛠️ Instalación y configuración

1. **Clona el repositorio:**

```bash
git clone https://github.com/betsabeiglesias/WeatherMood.git
cd WeatherMood
```

2. **Instala las dependencias:**

```bash
npm install
```

3. **Configura las variables de entorno:**

Crea un archivo `.env` en la raíz del proyecto, basado en `.env.example`, y completa tus datos:

```dotenv
WEATHER_API_KEY=tu_clave_de_weatherapi
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=hdnh2006/salamandra-7b-instruct
```

- `WEATHER_API_KEY`: Tu clave personal de WeatherAPI.
- `OLLAMA_URL`: URL local donde Ollama escucha (por defecto no hay que cambiarla).
- `OLLAMA_MODEL`: Modelo de lenguaje a utilizar.  
  Puedes usar:
  - `hdnh2006/salamandra-7b-instruct` (recomendado y probado).
  - O `llama3` u otro modelo que tengas disponible en Ollama.

> 💡 **Nota:** Si usas otro modelo, asegúrate de tenerlo descargado en Ollama (`ollama run llama3` o similar).

4. **Inicia el servidor local:**

```bash
npm start
```

Esto levantará un servidor en `http://localhost:3000`.

5. **Inicia Ollama en otra terminal:**

```bash
ollama serve
```

Asegúrate de que Ollama esté corriendo en `localhost:11434`.

Luego, carga el modelo si es necesario:

```bash
ollama run salamandra
```

o

```bash
ollama run llama3
```

---

## 🌐 Uso

- Abre tu navegador en [http://localhost:3000](http://localhost:3000)
- Haz clic en cualquier punto del mapa interactivo.
- Verás:
  - Información meteorológica actualizada del lugar.
  - Una frase inspiradora generada por IA en función del clima.
- También puedes actualizar la frase pulsando **Actualizar Inspiración**.

---

## 📦 Estructura del proyecto

```plaintext
WeatherMood/
├── index.html
├── styles.css
├── script.js
├── server.js
├── .env.example
├── package.json
└── README.md
```

---

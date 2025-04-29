window.addEventListener("DOMContentLoaded", () => {
  fetch("/env")
    .then((response) => response.json())
    .then((env) => {
      startApp(env);
    })
    .catch((error) => {
      console.error("Error loading environment variables:", error);
    });
});

function startApp(env) {
  const WEATHER_API_KEY = env.WEATHER_API_KEY;
  const OLLAMA_URL = env.OLLAMA_URL;
  const OLLAMA_MODEL = env.OLLAMA_MODEL;

  let userMarker = null;

  const map = L.map("map").setView([43.26, -2.93], 8);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap",
  }).addTo(map);

  userMarker = L.marker([43.26, -2.93])
    .addTo(map)
    .bindPopup("¡Hola desde Bilbao!");

  map.on("click", function (e) {
    const lat = e.latlng.lat;
    const lon = e.latlng.lng;

    console.log("Latitud:", lat, "Longitud:", lon);

    userMarker.setLatLng([lat, lon]).setPopupContent("Your Place!").openPopup();

    document.getElementById("phrase").innerHTML =
      '<div class="loading-spinner mx-auto"></div>';

    const urlweather = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${lat},${lon}`;

    fetch(urlweather)
      .then((response) => {
        if (!response.ok)
          throw new Error(
            "Error in the response from ApiWeather" + response.status
          );
        return response.json();
      })
      .then((data) => {
        console.log("API fetch successful");
        getInfo(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        document.getElementById("phrase").textContent =
          "Error al obtener datos del clima. Intenta nuevamente.";
      });
  });

  const refreshBtn = document.getElementById("refresh-btn");
  if (refreshBtn) {
    refreshBtn.addEventListener("click", () => {
      const location = document.getElementById("location").textContent;
      if (location !== "Selecciona una ubicación") {
        document.getElementById("phrase").innerHTML =
          '<div class="loading-spinner mx-auto"></div>';
        const center = map.getCenter();
        map.fire("click", { latlng: center });
      } else {
        document.getElementById("phrase").textContent =
          "Primero selecciona una ubicación en el mapa.";
      }
    });
  }

  const carouselPhrases = [
    "Haz clic en el mapa y deja que el clima te inspire con una frase única.",
    "Un lugar, un clima, una frase para ti.",
    "Explora el mundo y deja que el cielo te hable.",
    "El clima habla. Haz clic y escucha su mensaje.",
    "Cada rincón del mundo guarda una inspiración. Encuéntrala.",
  ];

  let indexFrase = 0;
  function changeCarouselPhrase() {
    const elemento = document.getElementById("header-carousel");
    if (!elemento) return;
    elemento.textContent = carouselPhrases[indexFrase];
    indexFrase = (indexFrase + 1) % carouselPhrases.length;
  }
  setInterval(changeCarouselPhrase, 5000);
  window.addEventListener("DOMContentLoaded", changeCarouselPhrase);

  function updateBackgroundByWeather(clima) {
    const body = document.body;
    if (clima.includes("sun") || clima.includes("clear")) {
      body.style.background =
        "linear-gradient(to bottom right, #fff7ed, #fcd34d)";
    } else if (clima.includes("rain") || clima.includes("drizzle")) {
      body.style.background =
        "linear-gradient(to bottom right, #cbd5e1, #64748b)";
    } else if (clima.includes("cloud")) {
      body.style.background =
        "linear-gradient(to bottom right, #e0e7ff, #94a3b8)";
    } else if (clima.includes("snow")) {
      body.style.background =
        "linear-gradient(to bottom right, #f0f9ff, #cbd5e1)";
    } else {
      body.style.background =
        "linear-gradient(to bottom right, #fdf2f8, #fae8ff)";
    }
  }

  function getInfo(data) {
    const summary = {
      city: data.location.name,
      region: data.location.region,
      country: data.location.country,
      time: data.location.localtime,
      temperature: data.current.temp_c,
      feeling: data.current.feelslike_c,
      clima: data.current.condition.text,
      icon: data.current.condition.icon,
      humidity: data.current.humidity,
      viento_kph: data.current.wind_kph,
      uv: data.current.uv,
      is_day: data.current.is_day === 1 ? "día" : "noche",
    };

    function updatePopup(city) {
      if (userMarker) {
        userMarker.setPopupContent(`${city}`).openPopup();
      }
    }

    updatePopup(summary.city);
    updateBackgroundByWeather(summary.clima.toLowerCase());

    document.getElementById(
      "temperature"
    ).textContent = `${summary.temperature}°C`;
    document.getElementById("wind").textContent = `${summary.viento_kph} km/h`;
    document.getElementById("humidity").textContent = `${summary.humidity}%`;
    document.getElementById("uv").textContent = summary.uv;
    document.getElementById(
      "location"
    ).textContent = `${summary.city}, ${summary.country}`;
    document.getElementById("time").textContent = summary.time;
    document.getElementById("weather-icon").src = `https:${summary.icon}`;

    generateMotivationalPhrase(summary);
  }

  async function generateMotivationalPhrase(infoWeather) {
    const spinner = document.getElementById("loading-spinner");
    const summary = `Hoy en ${infoWeather.city} (${
      infoWeather.country
    }) el clima es ${infoWeather.clima.toLowerCase()}, con ${
      infoWeather.temperature
    }°C, ${infoWeather.humidity}% de humidity y viento de ${
      infoWeather.viento_kph
    } km/h. Es de ${infoWeather.es_dia}.`;
    const prompt = `${summary}\nCon base en este clima, genera una frase breve y motivadora. Usa un tono cálido y optimista.`;

    try {
      spinner.classList.remove("hidden");

      const response = await fetch(`${OLLAMA_URL}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: OLLAMA_MODEL,
          prompt: prompt,
          stream: false,
        }),
      });

      const text = await response.text();
      const data = JSON.parse(text);
      const phrase = data.response || "No se pudo generar una frase.";
      showPhrase(phrase);
    } catch (error) {
      console.error("Ollama Error:", error);
      showPhrase(
        "No se pudo generar una frase. ¡Pero hoy es un buen día igual!"
      );
    } finally {
      spinner?.classList.add("hidden");
    }
  }

  function showPhrase(phrase) {
    const contenedor = document.getElementById("phrase");
    if (contenedor) {
      contenedor.innerHTML = `<span class="text-blue-600 font-semibold">✨ Inspiración del día:</span> ${phrase}`;
    }
  }
}

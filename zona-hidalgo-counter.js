// zona-hidalgo-counter.js (versión con protección contra dobles llamadas y bots)
document.addEventListener("DOMContentLoaded", () => {
  const counterElement = document.getElementById("visitorCounter");
  const baseUrl = "https://api.counterapi.dev/v2/zonahidalgos-team-1562/zona-hidalgo-visitantes";

  if (!counterElement) return console.warn("No se encontró #visitorCounter en la página.");

  // Guard interno para evitar múltiples ejecuciones en la misma carga
  if (window.__zonaHidalgo_counter_running) {
    console.log("ZonaHidalgo: contador ya en ejecución — evitando duplicado.");
    return;
  }
  window.__zonaHidalgo_counter_running = true;

  // Keys
  const LS_VISITED_KEY = "zonaHidalgoVisited";   // persistente (evita recargas)
  const SS_INCREMENT_KEY = "zonaHidalgoIncrementedThisSession"; // por pestaña (evita duplicados)

  // Simple detector de bots (no es perfecto, pero evita muchos contadores automáticos)
  function looksLikeBot() {
    const ua = navigator.userAgent || "";
    const botSignals = [
      "bot", "crawl", "spider", "slurp", "bingpreview", "facebookexternalhit",
      "curl", "wget", "python-requests", "httpclient", "postman", "headless"
    ];
    const lowerUa = ua.toLowerCase();
    if (navigator.webdriver || lowerUa.includes("headless")) return true;
    return botSignals.some(s => lowerUa.includes(s));
  }

  // Solo incrementar si la página está visible (evita precargas / prerender)
  if (document.visibilityState && document.visibilityState !== "visible") {
    // Esperar hasta que sea visible
    document.addEventListener("visibilitychange", function onVis() {
      if (document.visibilityState === "visible") {
        document.removeEventListener("visibilitychange", onVis);
        runCounter();
      }
    });
  } else {
    runCounter();
  }

  async function runCounter() {
    try {
      // Si parece bot, no contamos
      if (looksLikeBot()) {
        console.log("ZonaHidalgo: petición ignorada (posible bot).");
        // Aun así, obtener y mostrar valor actual para UI
        await fetchAndShow(false);
        return;
      }

      // Evitar múltiples incrementos en la misma pestaña/ventana
      if (sessionStorage.getItem(SS_INCREMENT_KEY) === "true") {
        console.log("ZonaHidalgo: ya incrementado en esta sesión (sessionStorage). Solo obtendremos el valor.");
        await fetchAndShow(false);
        return;
      }

      // Si localStorage indica que ya visitó en este navegador, solo obtener
      const alreadyVisited = localStorage.getItem(LS_VISITED_KEY) === "true";

      if (!alreadyVisited) {
        // Marcar en sessionStorage para evitar dos incrementos por recarga rápida
        sessionStorage.setItem(SS_INCREMENT_KEY, "true");

        // Llamada para incrementar (solo una vez por esta carga)
        const incResp = await fetchWithGuard(`${baseUrl}/up`);
        if (incResp) {
          localStorage.setItem(LS_VISITED_KEY, "true"); // persistir para futuras visitas
          counterElement.textContent = extractCount(incResp);
          console.log("ZonaHidalgo: incremento solicitado. Respuesta:", incResp);
        } else {
          // si falla incrementar, intentar solo obtener valor
          await fetchAndShow(false);
        }
      } else {
        // Ya visitó antes en este navegador -> solo obtener valor
        await fetchAndShow(false);
      }
    } catch (err) {
      console.error("ZonaHidalgo: error en runCounter:", err);
      counterElement.textContent = "Error al cargar";
    }
  }

  // Hace fetch a la API con options seguros y devuelve JSON o null
  async function fetchWithGuard(url) {
    try {
      // Evitar que intermediarios hagan prefetch con HEAD/OPTIONS: usar GET explícito
      const resp = await fetch(url, { method: "GET", cache: "no-store", mode: "cors" });
      if (!resp.ok) {
        console.warn("ZonaHidalgo: fetch no OK:", resp.status, url);
        return null;
      }
      const json = await resp.json();
      return json;
    } catch (e) {
      console.error("ZonaHidalgo: fetchWithGuard error:", e);
      return null;
    }
  }

  // Extrae el contador real desde la respuesta de la API
  function extractCount(apiJson) {
    // Según tu JSON observado, el valor real está en data.data.up_count
    // Hacemos fallback a varias propiedades por seguridad
    const count =
      apiJson?.data?.up_count ??
      apiJson?.data?.count ??
      apiJson?.count ??
      apiJson?.up_count ??
      0;
    // Mostrar formateado
    try {
      return Number(count).toLocaleString("es-MX");
    } catch {
      return String(count);
    }
  }

  // Obtener y mostrar el valor actual (sin incrementar)
  async function fetchAndShow(increment = false) {
    const url = `${baseUrl}` + (increment ? "/up" : "");
    const json = await fetchWithGuard(url);
    if (json) {
      counterElement.textContent = extractCount(json);
      console.log("ZonaHidalgo: valor mostrado:", extractCount(json));
    } else {
      counterElement.textContent = "Error al cargar";
    }
  }
});

// ---------- contador limpio y funcional ----------
document.addEventListener("DOMContentLoaded", () => {
  const counterElement = document.getElementById("visitorCounter");
  if (!counterElement) return console.warn("No se encontró #visitorCounter en la página.");

  const baseUrl = "https://api.counterapi.dev/v2/zonahidalgos-team-1562/zona-hidalgo-visitantes"; // revisa esto
  const LS_VISITED_KEY = "zonaHidalgoVisited_v2";
  const SS_INCREMENT_KEY = "zonaHidalgoIncrementedThisSession_v2";

  // evita doble ejecución si el script se carga más de una vez
  if (window.__zonaHidalgo_counter_running) return;
  window.__zonaHidalgo_counter_running = true;

  counterElement.style.transition = 'opacity 0.3s ease-in-out';

  function looksLikeBot() {
    const ua = navigator.userAgent || "";
    const lower = ua.toLowerCase();
    const botSignals = [
      "bot","crawl","spider","slurp","bingpreview",
      "facebookexternalhit","curl","wget","python-requests",
      "httpclient","postman","headless"
    ];
    return navigator.webdriver || botSignals.some(b => lower.includes(b));
  }

  async function fetchWithGuard(url) {
    try {
      console.debug("ZonaHidalgo: fetch ->", url);
      const resp = await fetch(url, { method: "GET", cache: "no-store", mode: "cors" });
      console.debug("ZonaHidalgo: status", resp.status);
      if (!resp.ok) {
        console.warn("ZonaHidalgo: respuesta no OK", resp.status, resp.statusText);
        return null;
      }
      const json = await resp.json();
      console.debug("ZonaHidalgo: json", json);
      return json;
    } catch (err) {
      console.error("ZonaHidalgo: fetch error", err);
      return null;
    }
  }

  function extractCount(apiJson) {
    const count =
      apiJson?.data?.up_count ??
      apiJson?.data?.count ??
      apiJson?.count ??
      apiJson?.up_count ??
      0;
    return Number(count).toLocaleString("es-MX");
  }

  async function fetchAndShow(increment = false) {
    const url = `${baseUrl}` + (increment ? "/up" : "");
    const json = await fetchWithGuard(url);
    if (json) {
      counterElement.textContent = extractCount(json);
      counterElement.style.opacity = "1";
    } else {
      counterElement.textContent = "—";
      counterElement.style.opacity = "0.6";
    }
  }

  async function runCounter() {
    try {
      if (looksLikeBot()) {
        console.log("ZonaHidalgo: Ignorado (bot detectado)");
        return await fetchAndShow(false);
      }

      // evitar recuento múltiple en la misma sesión
      if (sessionStorage.getItem(SS_INCREMENT_KEY)) {
        console.log("ZonaHidalgo: ya incrementado esta sesión");
        return await fetchAndShow(false);
      }

      const alreadyVisited = localStorage.getItem(LS_VISITED_KEY) === "true";

      if (!alreadyVisited) {
        sessionStorage.setItem(SS_INCREMENT_KEY, "true");
        const incResp = await fetchWithGuard(`${baseUrl}/up`);
        if (incResp) {
          localStorage.setItem(LS_VISITED_KEY, "true");
          counterElement.textContent = extractCount(incResp);
        } else {
          // si no pudo incrementar, igual mostramos el conteo actual (si existe)
          await fetchAndShow(false);
        }
      } else {
        await fetchAndShow(false);
      }
    } catch (err) {
      console.error("ZonaHidalgo: error en runCounter:", err);
      counterElement.textContent = "Error al cargar";
    }
  }

  // inicializador público
  function initVisitorCounter() {
    // ejecuta cuando la página ya sea visible (evita contar si está en background)
    if (document.visibilityState !== "visible") {
      document.addEventListener("visibilitychange", function onVis() {
        if (document.visibilityState === "visible") {
          document.removeEventListener("visibilitychange", onVis);
          runCounter();
        }
      });
    } else {
      runCounter();
    }
  }

  // arranca
  initVisitorCounter();
});
// ---------- fin contador ----------

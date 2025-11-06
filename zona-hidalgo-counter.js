// ============================================
// zona-hidalgo-counter.js (versión estable y limpia)
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  const counterElement = document.getElementById("visitorCounter");
  const baseUrl = "https://api.counterapi.dev/v2/zonahidalgos-team-1562/zona-hidalgo-visitantes";

  if (!counterElement) return console.warn("No se encontró #visitorCounter en la página.");

  // Evita dobles ejecuciones en la misma carga
  if (window.__zonaHidalgo_counter_running) return;
  window.__zonaHidalgo_counter_running = true;

  const LS_VISITED_KEY = "zonaHidalgoVisited_v2";
  const SS_INCREMENT_KEY = "zonaHidalgoIncrementedThisSession_v2";

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
      const resp = await fetch(url, { method: "GET", cache: "no-store", mode: "cors" });
      if (!resp.ok) return null;
      return await resp.json();
    } catch {
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
    const url = baseUrl + (increment ? "/up" : "");
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

      // Evitar recuento en la misma sesión
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

  // Ejecutar cuando la página esté visible
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

  // Agregar transición CSS para animación suave
  counterElement.style.transition = "opacity 0.3s ease-in-out";
});


// ============================================
// MODALS - STAFF Y PROGRAMAS
// ============================================

document.addEventListener("DOMContentLoaded", function () {

  // ===== MODALS DE STAFF =====
  const staffCards = document.querySelectorAll(".staff-card");
  const staffModals = document.querySelectorAll(".staff-modal");

  staffCards.forEach(card => {
    card.addEventListener("click", () => {
      const modalId = card.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = "block";
      }
    });
  });

  staffModals.forEach(modal => {
    const closeBtn = modal.querySelector(".close-btn");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    modal.addEventListener("click", e => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  // ===== MODALS DE PROGRAMAS =====
  const programCards = document.querySelectorAll(".program-card");
  const programModals = document.querySelectorAll(".program-modal");

  programCards.forEach(card => {
    card.addEventListener("click", () => {
      const modalId = card.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = "block";
      }
    });
  });

  programModals.forEach(modal => {
    const closeBtn = modal.querySelector(".close-btn");

    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });
    }

    modal.addEventListener("click", e => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  });

  // Cerrar modals con tecla ESC
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      document.querySelectorAll(".staff-modal, .program-modal").forEach(modal => {
        modal.style.display = "none";
      });
    }
  });
});

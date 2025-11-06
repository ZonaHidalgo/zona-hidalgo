// zona-hidalgo-counter.js
document.addEventListener("DOMContentLoaded", async () => {
  const counterElement = document.getElementById("visitorCounter");
  const baseUrl = "https://api.counterapi.dev/v2/zonahidalgos-team-1562/zona-hidalgo-visitantes";

  // Verifica si ya visitó antes
  const hasVisited = localStorage.getItem("zonaHidalgoVisited");

  try {
    let response;

    if (!hasVisited) {
      // Primera visita → incrementa
      response = await fetch(`${baseUrl}/up`);
      localStorage.setItem("zonaHidalgoVisited", "true");
    } else {
      // Ya visitó → solo obtiene valor actual
      response = await fetch(baseUrl);
    }

    if (!response.ok) throw new Error("Error al conectar con API Counter");

    const data = await response.json();

    // CORRECCIÓN: la API devuelve el contador en data.data.up_count
    const count = data.data?.up_count ?? 0;

    counterElement.textContent = count;
  } catch (error) {
    console.error(error);
    counterElement.textContent = "Error al cargar";
  }
});

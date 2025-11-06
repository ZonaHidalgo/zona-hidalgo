// zona-hidalgo-counter.js
document.addEventListener("DOMContentLoaded", async () => {
  const counterElement = document.getElementById("visitorCounter");
  const baseUrl = "https://api.counterapi.dev/v2/zonahidalgos-team-1562/zona-hidalgo-visitantes";

  // Revisa si el usuario ya visitó antes (para no contar recargas)
  const hasVisited = localStorage.getItem("zonaHidalgoVisited");

  try {
    let response;

    if (!hasVisited) {
      // Si es la primera visita, incrementa el contador
      response = await fetch(`${baseUrl}/up`);
      localStorage.setItem("zonaHidalgoVisited", "true");
    } else {
      // Si ya visitó antes, solo obtiene el valor actual
      response = await fetch(baseUrl);
    }

    if (!response.ok) throw new Error("Error al conectar con API Counter");

    const data = await response.json();

    // Muestra el valor actual en pantalla
    counterElement.textContent = data.count ?? "0";
  } catch (error) {
    console.error(error);
    counterElement.textContent = "Error al cargar";
  }
});

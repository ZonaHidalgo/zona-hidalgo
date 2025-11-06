// ============================================
// CONTADOR DE VISITANTES ÚNICOS - ZONA HIDALGO
// Usando CounterAPI.dev (v2)
// ============================================

(function() {
  'use strict';

  // Configuración de CounterAPI
  const WORKSPACE_SLUG = 'zonahidalgos-team-1562';
  const COUNTER_SLUG = 'zona-hidalgo-visitantes';
  const API_BASE_URL = 'https://api.counterapi.dev/v2';
  const API_KEY = 'YOUR_API_KEY'; // 🔑 Reemplaza con tu clave real
  
  // Clave local para marcar si este usuario ya visitó
  const LOCAL_VISITOR_KEY = 'zona_hidalgo_user_visited';
  
  // Elemento del contador en el DOM
  const counterElement = document.getElementById('visitorCounter');

  // ========== FUNCIONES DE API ==========

  /**
   * Obtiene el conteo actual del contador
   */
  async function getCurrentCount() {
    try {
      const url = `${API_BASE_URL}/${WORKSPACE_SLUG}/${COUNTER_SLUG}`;
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${API_KEY}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Error al obtener contador:', error);
      return null;
    }
  }

  /**
   * Incrementa el contador en 1 (solo si es nuevo visitante)
   */
  async function incrementCounter() {
    try {
      const url = `${API_BASE_URL}/${WORKSPACE_SLUG}/${COUNTER_SLUG}/up`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${API_KEY}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Error al incrementar contador:', error);
      return null;
    }
  }

  // ========== FUNCIONES LOCALES ==========

  function hasUserVisited() {
    return localStorage.getItem(LOCAL_VISITOR_KEY) === 'true';
  }

  function markUserAsVisited() {
    const timestamp = new Date().toISOString();
    localStorage.setItem(LOCAL_VISITOR_KEY, 'true');
    localStorage.setItem(LOCAL_VISITOR_KEY + '_date', timestamp);
  }

  function updateCounterDisplay(count) {
    if (counterElement) {
      counterElement.style.opacity = '0';
      setTimeout(() => {
        if (count !== null) {
          counterElement.textContent = count.toLocaleString('es-MX');
        } else {
          counterElement.textContent = 'Error';
        }
        counterElement.style.opacity = '1';
      }, 150);
    }
  }

  function logVisitorInfo(isNew, count) {
    const emoji = isNew ? '🎉' : '👋';
    const message = isNew 
      ? '¡Nuevo visitante! Bienvenido a Zona Hidalgo' 
      : 'Bienvenido de vuelta a Zona Hidalgo';
    
    console.log(`${emoji} ${message}`);
    console.log(`📊 Total de visitantes únicos: ${count}`);
  }

  // ========== LÓGICA PRINCIPAL ==========

  async function initVisitorCounter() {
    try {
      if (counterElement) {
        counterElement.textContent = 'Cargando...';
      }

      const userHasVisited = hasUserVisited();
      let currentCount;

      if (!userHasVisited) {
        currentCount = await incrementCounter();
        if (currentCount !== null) {
          markUserAsVisited();
          logVisitorInfo(true, currentCount);
        }
      } else {
        currentCount = await getCurrentCount();
        logVisitorInfo(false, currentCount);
      }

      updateCounterDisplay(currentCount);
      
    } catch (error) {
      console.error('❌ Error al inicializar contador:', error);
      if (counterElement) {
        counterElement.textContent = 'Error';
      }
    }
  }

  // ========== FUNCIONES GLOBALES DE UTILIDAD ==========

  window.resetMyVisit = function() {
    localStorage.removeItem(LOCAL_VISITOR_KEY);
    localStorage.removeItem(LOCAL_VISITOR_KEY + '_date');
    console.log('✅ Tu marca de visita ha sido eliminada');
    console.log('🔄 Recarga la página para contar como visitante nuevo');
  };

  window.showZonaHidalgoStats = async function() {
    const count = await getCurrentCount();
    const visited = localStorage.getItem(LOCAL_VISITOR_KEY);
    const visitDate = localStorage.getItem(LOCAL_VISITOR_KEY + '_date');
    
    console.log('📊 ESTADÍSTICAS ZONA HIDALGO');
    console.log('============================');
    console.log('Total visitantes únicos:', count);
    console.log('¿Ya visitaste antes?:', visited === 'true' ? 'Sí' : 'No');
    console.log('Fecha de tu primera visita:', visitDate || 'N/A');
    console.log('============================');
  };

  window.getCounter = async function() {
    const count = await getCurrentCount();
    console.log(`📊 Contador actual: ${count}`);
    return count;
  };

  // ========== INICIALIZACIÓN ==========
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisitorCounter);
  } else {
    initVisitorCounter();
  }

  if (counterElement) {
    counterElement.style.transition = 'opacity 0.3s ease-in-out';
  }

})();

// ============================================
// MODALS - STAFF Y PROGRAMAS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // ===== MODALS DE STAFF =====
  const staffCards = document.querySelectorAll('.staff-card');
  const staffModals = document.querySelectorAll('.staff-modal');

  staffCards.forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = 'block';
    });
  });

  staffModals.forEach(modal => {
    const closeBtn = modal.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.style.display = 'none');
    }
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.style.display = 'none';
    });
  });

  // ===== MODALS DE PROGRAMAS =====
  const programCards = document.querySelectorAll('.program-card');
  const programModals = document.querySelectorAll('.program-modal');

  programCards.forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) modal.style.display = 'block';
    });
  });

  programModals.forEach(modal => {
    const closeBtn = modal.querySelector('.close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.style.display = 'none');
    }
    modal.addEventListener('click', e => {
      if (e.target === modal) modal.style.display = 'none';
    });
  });

  // Cerrar modals con tecla ESC
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.staff-modal, .program-modal').forEach(modal => {
        modal.style.display = 'none';
      });
    }
  });
});

// ============================================
// CONTADOR DE VISITANTES ÚNICOS - ZONA HIDALGO
// ============================================

(function() {
  'use strict';

  // Claves para el almacenamiento
  const VISITOR_KEY = 'zona_hidalgo_visited';
  const COUNT_KEY = 'zona_hidalgo_visitor_count';
  const LAST_RESET_KEY = 'zona_hidalgo_last_reset';
  
  // Elemento del contador en el DOM
  const counterElement = document.getElementById('visitorCounter');

  // ========== FUNCIONES AUXILIARES ==========
  
  /**
   * Obtiene el conteo actual de visitantes
   */
  function getVisitorCount() {
    const count = localStorage.getItem(COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
  }

  /**
   * Incrementa el contador de visitantes
   */
  function incrementVisitorCount() {
    const currentCount = getVisitorCount();
    const newCount = currentCount + 1;
    localStorage.setItem(COUNT_KEY, newCount.toString());
    return newCount;
  }

  /**
   * Verifica si es un visitante nuevo
   */
  function isNewVisitor() {
    return localStorage.getItem(VISITOR_KEY) === null;
  }

  /**
   * Marca al usuario como visitante registrado
   */
  function markAsVisited() {
    const timestamp = new Date().toISOString();
    localStorage.setItem(VISITOR_KEY, timestamp);
  }

  /**
   * Actualiza el display del contador en la página
   */
  function updateCounterDisplay(count) {
    if (counterElement) {
      // Animación suave del número
      counterElement.style.opacity = '0';
      
      setTimeout(() => {
        counterElement.textContent = count.toLocaleString('es-MX');
        counterElement.style.opacity = '1';
      }, 150);
    }
  }

  /**
   * Registra información en consola (para debugging)
   */
  function logVisitorInfo(isNew, count) {
    const emoji = isNew ? '🎉' : '👋';
    const message = isNew 
      ? `¡Nuevo visitante! Bienvenido a Zona Hidalgo` 
      : `Bienvenido de vuelta a Zona Hidalgo`;
    
    console.log(`${emoji} ${message}`);
    console.log(`📊 Total de visitantes únicos: ${count}`);
  }

  // ========== LÓGICA PRINCIPAL ==========
  
  /**
   * Inicializa el contador de visitantes
   */
  function initVisitorCounter() {
    try {
      let currentCount;
      
      if (isNewVisitor()) {
        // Es un visitante nuevo - incrementamos
        currentCount = incrementVisitorCount();
        markAsVisited();
        logVisitorInfo(true, currentCount);
      } else {
        // Ya visitó antes - solo mostramos el conteo
        currentCount = getVisitorCount();
        logVisitorInfo(false, currentCount);
      }
      
      // Actualizamos el display
      updateCounterDisplay(currentCount);
      
    } catch (error) {
      console.error('❌ Error al inicializar contador:', error);
      if (counterElement) {
        counterElement.textContent = 'Error';
      }
    }
  }

  // ========== FUNCIONES GLOBALES (OPCIONAL) ==========
  
  /**
   * Resetea el contador (útil para pruebas)
   * Uso: En la consola escribir: resetZonaHidalgoCounter()
   */
  window.resetZonaHidalgoCounter = function() {
    if (confirm('¿Estás seguro de resetear el contador de visitantes?')) {
      localStorage.removeItem(VISITOR_KEY);
      localStorage.removeItem(COUNT_KEY);
      localStorage.removeItem(LAST_RESET_KEY);
      console.log('✅ Contador reseteado');
      location.reload();
    }
  };

  /**
   * Muestra estadísticas del contador
   * Uso: En la consola escribir: showZonaHidalgoStats()
   */
  window.showZonaHidalgoStats = function() {
    const count = getVisitorCount();
    const visited = localStorage.getItem(VISITOR_KEY);
    const isNew = isNewVisitor();
    
    console.log('📊 ESTADÍSTICAS ZONA HIDALGO');
    console.log('============================');
    console.log('Total visitantes únicos:', count);
    console.log('¿Usuario nuevo?:', isNew ? 'Sí' : 'No');
    console.log('Primera visita:', visited || 'N/A');
    console.log('============================');
  };

  // ========== INICIALIZACIÓN ==========
  
  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initVisitorCounter);
  } else {
    // El DOM ya está listo
    initVisitorCounter();
  }

  // Agregar transición CSS para animación suave
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
      if (modal) {
        modal.style.display = 'block';
      }
    });
  });

  staffModals.forEach(modal => {
    const closeBtn = modal.querySelector('.close-btn');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });

  // ===== MODALS DE PROGRAMAS =====
  const programCards = document.querySelectorAll('.program-card');
  const programModals = document.querySelectorAll('.program-modal');

  programCards.forEach(card => {
    card.addEventListener('click', () => {
      const modalId = card.dataset.modal;
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.style.display = 'block';
      }
    });
  });

  programModals.forEach(modal => {
    const closeBtn = modal.querySelector('.close-btn');
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }
    
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.style.display = 'none';
      }
    });
  });

  // Cerrar modals con tecla ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.staff-modal, .program-modal').forEach(modal => {
        modal.style.display = 'none';
      });
    }
  });
  
});
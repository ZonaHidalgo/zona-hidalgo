// ============================================
// CONTADOR COMPARTIDO DE VISITANTES ÚNICOS - ZONA HIDALGO
// ============================================

(function() {
  'use strict';

  // Claves para el almacenamiento
  const VISITOR_KEY = 'zona_hidalgo_user_visited'; // Local: marca si este usuario ya visitó
  const SHARED_COUNT_KEY = 'zona_hidalgo_total_count'; // Compartido: contador global
  
  // Elemento del contador en el DOM
  const counterElement = document.getElementById('visitorCounter');

  // ========== FUNCIONES DE ALMACENAMIENTO ==========
  
  /**
   * Obtiene el conteo compartido global
   */
  async function getSharedCount() {
    try {
      const result = await window.storage.get(SHARED_COUNT_KEY, true);
      return result ? parseInt(result.value, 10) : 0;
    } catch (error) {
      // Si no existe, retorna 0
      return 0;
    }
  }

  /**
   * Incrementa el contador compartido global
   */
  async function incrementSharedCount() {
    try {
      const currentCount = await getSharedCount();
      const newCount = currentCount + 1;
      await window.storage.set(SHARED_COUNT_KEY, newCount.toString(), true);
      return newCount;
    } catch (error) {
      console.error('Error al incrementar contador:', error);
      return null;
    }
  }

  /**
   * Verifica si este usuario ya visitó (almacenamiento local del navegador)
   */
  function hasUserVisited() {
    return localStorage.getItem(VISITOR_KEY) === 'true';
  }

  /**
   * Marca al usuario como visitante registrado (almacenamiento local)
   */
  function markUserAsVisited() {
    const timestamp = new Date().toISOString();
    localStorage.setItem(VISITOR_KEY, 'true');
    localStorage.setItem(VISITOR_KEY + '_date', timestamp);
  }

  /**
   * Actualiza el display del contador en la página
   */
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

  /**
   * Registra información en consola (para debugging)
   */
  function logVisitorInfo(isNew, count) {
    const emoji = isNew ? '🎉' : '👋';
    const message = isNew 
      ? `¡Nuevo visitante! Bienvenido a Zona Hidalgo` 
      : `Bienvenido de vuelta a Zona Hidalgo`;
    
    console.log(`${emoji} ${message}`);
    console.log(`📊 Total de visitantes únicos GLOBAL: ${count}`);
  }

  // ========== LÓGICA PRINCIPAL ==========
  
  /**
   * Inicializa el contador de visitantes compartido
   */
  async function initVisitorCounter() {
    try {
      // Mostrar "Cargando..." mientras se obtiene el conteo
      if (counterElement) {
        counterElement.textContent = 'Cargando...';
      }

      const userHasVisited = hasUserVisited();
      let currentCount;

      if (!userHasVisited) {
        // Es un visitante nuevo - incrementamos el contador compartido
        currentCount = await incrementSharedCount();
        markUserAsVisited();
        logVisitorInfo(true, currentCount);
      } else {
        // Ya visitó antes - solo mostramos el conteo actual
        currentCount = await getSharedCount();
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
   * Resetea SOLO la marca local de este usuario (para pruebas)
   * Uso: resetMyVisit()
   */
  window.resetMyVisit = function() {
    localStorage.removeItem(VISITOR_KEY);
    localStorage.removeItem(VISITOR_KEY + '_date');
    console.log('✅ Tu visita ha sido reseteada localmente');
    console.log('🔄 Recarga la página para contar como visitante nuevo');
  };

  /**
   * Muestra estadísticas del contador
   * Uso: showZonaHidalgoStats()
   */
  window.showZonaHidalgoStats = async function() {
    const count = await getSharedCount();
    const visited = localStorage.getItem(VISITOR_KEY);
    const visitDate = localStorage.getItem(VISITOR_KEY + '_date');
    
    console.log('📊 ESTADÍSTICAS ZONA HIDALGO');
    console.log('============================');
    console.log('Total visitantes únicos (GLOBAL):', count);
    console.log('¿Ya visitaste antes?:', visited === 'true' ? 'Sí' : 'No');
    console.log('Fecha de tu primera visita:', visitDate || 'N/A');
    console.log('============================');
  };

  /**
   * Función de ADMIN para resetear el contador global
   * CUIDADO: Esto afecta a todos los usuarios
   * Uso: resetGlobalCounter('CONFIRMAR')
   */
  window.resetGlobalCounter = async function(confirmText) {
    if (confirmText !== 'CONFIRMAR') {
      console.log('⚠️ Para resetear el contador global escribe:');
      console.log('resetGlobalCounter("CONFIRMAR")');
      return;
    }
    
    if (confirm('⚠️ ADVERTENCIA: Esto reseteará el contador para TODOS los usuarios. ¿Estás seguro?')) {
      try {
        await window.storage.set(SHARED_COUNT_KEY, '0', true);
        console.log('✅ Contador global reseteado a 0');
        location.reload();
      } catch (error) {
        console.error('❌ Error al resetear:', error);
      }
    }
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

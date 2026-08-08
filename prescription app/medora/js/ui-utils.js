/**
 * Medora - UI Utility Functions
 * Modals, Toasts, Canvas Chart Engine, Theme Switcher
 */

export function showToast(message, type = 'info') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  const iconMap = {
    success: '✓',
    warning: '⚠️',
    danger: '✕',
    info: 'ℹ️'
  };

  toast.innerHTML = `
    <span style="font-weight: 800; font-size: 1.1rem;">${iconMap[type] || 'ℹ️'}</span>
    <span style="font-size: 0.85rem; font-weight: 600;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

export function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

export function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

export function initModalListeners() {
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close-modal');
      closeModal(modalId);
    });
  });
}

export function initTheme() {
  const savedTheme = localStorage.getItem('medora_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('medora_theme', next);
      showToast(`Switched to ${next} theme mode`, 'info');
    });
  }
}

/**
 * Draw responsive line charts using standard HTML5 Canvas
 */
export function drawCanvasVitalsChart(canvasId, vitalsData) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // Resize to element resolution
  const width = canvas.parentElement.clientWidth || 600;
  const height = 220;
  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);

  if (!vitalsData || vitalsData.length === 0) return;

  const reversed = [...vitalsData].reverse();
  const padding = 40;
  const graphWidth = width - padding * 2;
  const graphHeight = height - padding * 2;

  // Draw Grid Lines
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color') || '#e2e8f0';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding + (graphHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }

  // Draw Systolic BP Line (Teal/Primary)
  ctx.strokeStyle = '#0d9488';
  ctx.lineWidth = 3;
  ctx.beginPath();

  const maxVal = 160;
  const minVal = 60;

  reversed.forEach((entry, idx) => {
    const x = padding + (graphWidth / (reversed.length - 1 || 1)) * idx;
    const norm = (entry.bpSystolic - minVal) / (maxVal - minVal);
    const y = height - padding - norm * graphHeight;

    if (idx === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw Dots & Labels
  reversed.forEach((entry, idx) => {
    const x = padding + (graphWidth / (reversed.length - 1 || 1)) * idx;
    const norm = (entry.bpSystolic - minVal) / (maxVal - minVal);
    const y = height - padding - norm * graphHeight;

    ctx.fillStyle = '#0d9488';
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    // Date label
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-muted') || '#64748b';
    ctx.font = '10px Plus Jakarta Sans';
    ctx.textAlign = 'center';
    ctx.fillText(entry.date.substring(5, 10), x, height - 10);
  });
}

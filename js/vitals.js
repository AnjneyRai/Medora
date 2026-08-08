/**
 * Medora - Vitals & Health Overview Controller
 * Log Form & Canvas Visualizations
 */

import { store } from './store.js';
import { drawCanvasVitalsChart, showToast, closeModal } from './ui-utils.js';

export function renderVitalsView() {
  const vitals = store.getVitals();
  
  // 1. Draw Canvas Chart
  drawCanvasVitalsChart('vitals-canvas-chart', vitals);

  // 2. Populate History Table
  const tableBody = document.getElementById('vitals-table-body');
  if (!tableBody) return;

  if (vitals.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No vitals logged yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = vitals.map(v => `
    <tr>
      <td><strong>${v.date.replace('T', ' ')}</strong></td>
      <td>
        <span class="badge ${v.bpSystolic > 130 ? 'badge-warning' : 'badge-success'}">
          ${v.bpSystolic} / ${v.bpDiastolic} mmHg
        </span>
      </td>
      <td>${v.heartRate} bpm</td>
      <td>${v.bloodSugar} mg/dL</td>
      <td>${v.spo2}%</td>
      <td>${v.temp} °F</td>
    </tr>
  `).join('');
}

export function handleLogVitalSubmit(e) {
  e.preventDefault();
  
  const entry = {
    id: 'V-' + Math.floor(100 + Math.random() * 900),
    date: new Date().toISOString().substring(0, 16),
    bpSystolic: parseInt(document.getElementById('vital-bp-sys').value) || 120,
    bpDiastolic: parseInt(document.getElementById('vital-bp-dia').value) || 80,
    heartRate: parseInt(document.getElementById('vital-pulse').value) || 72,
    bloodSugar: parseInt(document.getElementById('vital-glucose').value) || 100,
    spo2: parseInt(document.getElementById('vital-spo2').value) || 98,
    temp: parseFloat(document.getElementById('vital-temp').value) || 98.6
  };

  store.addVital(entry);
  closeModal('modal-log-vital');
  showToast('New vitals recorded successfully!', 'success');
  renderVitalsView();
}

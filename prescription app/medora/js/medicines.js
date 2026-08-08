/**
 * Medora - Medicine Directory Controller
 * Catalog Search, Category Filters & Drug Detail Drawer
 */

import { store } from './store.js';
import { openModal } from './ui-utils.js';

let activeCategory = 'all';

export function renderMedicinesView() {
  const medicines = store.getMedicines();
  const searchInput = document.getElementById('search-medicine-input');
  const query = searchInput ? searchInput.value.toLowerCase().trim() : '';

  // Filter medicines
  const filtered = medicines.filter(m => {
    const matchesCategory = (activeCategory === 'all') || (m.category.toLowerCase().includes(activeCategory.toLowerCase()));
    const matchesQuery = !query || m.name.toLowerCase().includes(query) || m.category.toLowerCase().includes(query) || m.description.toLowerCase().includes(query);
    return matchesCategory && matchesQuery;
  });

  const container = document.getElementById('medicines-catalog-grid');
  if (!container) return;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
        <h3>No Medicines Found</h3>
        <p>Try searching for a different drug name or clear category filters.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(m => `
    <div class="card" style="display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
          <span class="badge ${m.controlled ? 'badge-danger' : 'badge-neutral'}">${m.category}</span>
          ${m.controlled ? '<span class="badge badge-warning">Rx Controlled</span>' : ''}
        </div>

        <h3 style="font-size: 1.15rem; color: var(--primary); margin-bottom: 0.25rem;">${m.name}</h3>
        <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); margin-bottom: 0.75rem;">${m.dosageForm} • ${m.strength}</div>

        <p style="font-size: 0.85rem; line-height: 1.4; margin-bottom: 1rem;">${m.description}</p>
      </div>

      <div style="border-top: 1px solid var(--border-color); padding-top: 0.85rem; display: flex; align-items: center; justify-content: space-between;">
        <span style="font-weight: 800; font-size: 1rem; color: var(--text-main);">${m.price}</span>
        <button class="btn btn-secondary btn-sm" onclick="window.viewMedicineDetails('${m.id}')">ℹ️ View Full Info</button>
      </div>
    </div>
  `).join('');
}

export function initMedicinesListeners() {
  document.getElementById('search-medicine-input')?.addEventListener('input', () => {
    renderMedicinesView();
  });

  document.querySelectorAll('[data-med-category]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('[data-med-category]').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      activeCategory = e.target.getAttribute('data-med-category');
      renderMedicinesView();
    });
  });
}

window.viewMedicineDetails = function(id) {
  const medicines = store.getMedicines();
  const med = medicines.find(m => m.id === id);
  if (!med) return;

  const modalBody = document.getElementById('medicine-detail-container');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div>
      <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1rem;">
        <h2 style="color: var(--primary);">${med.name}</h2>
        <span class="badge badge-info">${med.strength}</span>
      </div>

      <div class="grid-cols-2" style="margin-bottom: 1rem;">
        <div>
          <span class="form-label" style="color: var(--text-muted);">Category</span>
          <div style="font-weight: 700;">${med.category}</div>
        </div>
        <div>
          <span class="form-label" style="color: var(--text-muted);">Dosage Form</span>
          <div style="font-weight: 700;">${med.dosageForm}</div>
        </div>
      </div>

      <div style="margin-bottom: 1rem;">
        <span class="form-label" style="color: var(--text-muted);">Indication & Clinical Summary</span>
        <p style="font-size: 0.9rem; color: var(--text-main);">${med.description}</p>
      </div>

      <div style="margin-bottom: 1rem; background: var(--warning-light); padding: 1rem; border-radius: 8px;">
        <div style="font-weight: 800; font-size: 0.85rem; color: #b45309; text-transform: uppercase; margin-bottom: 0.35rem;">Common Side Effects</div>
        <div style="font-size: 0.85rem; color: #78350f;">${med.sideEffects.join(', ')}</div>
      </div>

      <div style="background: var(--danger-light); padding: 1rem; border-radius: 8px;">
        <div style="font-weight: 800; font-size: 0.85rem; color: #b91c1c; text-transform: uppercase; margin-bottom: 0.35rem;">Contraindications & Warnings</div>
        <div style="font-size: 0.85rem; color: #7f1d1d;">${med.contraindications}</div>
      </div>
    </div>
  `;

  openModal('modal-medicine-detail');
};

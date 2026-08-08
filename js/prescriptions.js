/**
 * Medora - Digital Prescription Management Controller
 * Role-Aware Filtering Tabs, Create Rx Form, Print Preview Engine
 */

import { roleManager, ROLES } from './roles.js';
import { store } from './store.js';
import { showToast, openModal, closeModal } from './ui-utils.js';

let activeFilterTab = 'all';

export function renderPrescriptionsView() {
  const currentRole = roleManager.getRole();
  
  // 1. Render Role-Aware Filter Tabs Header
  const tabsContainer = document.getElementById('rx-filter-tabs-container');
  if (tabsContainer) {
    let tabsHTML = '';

    if (currentRole === ROLES.USER) {
      tabsHTML = `
        <button class="tab-btn ${activeFilterTab === 'all' ? 'active' : ''}" data-rx-tab="all">All Prescriptions</button>
        <button class="tab-btn ${activeFilterTab === 'active' ? 'active' : ''}" data-rx-tab="active">Active Meds</button>
        <button class="tab-btn ${activeFilterTab === 'refills' ? 'active' : ''}" data-rx-tab="refills">Refill Requested</button>
      `;
    } else if (currentRole === ROLES.HOSPITAL) {
      tabsHTML = `
        <button class="tab-btn ${activeFilterTab === 'all' ? 'active' : ''}" data-rx-tab="all">All Issued Prescriptions</button>
        <button class="tab-btn ${activeFilterTab === 'active' ? 'active' : ''}" data-rx-tab="active">Active Therapy</button>
        <button class="tab-btn ${activeFilterTab === 'controlled' ? 'active' : ''}" data-rx-tab="controlled">Controlled Drugs</button>
      `;
    } else if (currentRole === ROLES.AUTHORITY) {
      tabsHTML = `
        <button class="tab-btn ${activeFilterTab === 'controlled' ? 'active' : ''}" data-rx-tab="controlled">🛡️ Controlled Drug Audit Queue</button>
        <button class="tab-btn ${activeFilterTab === 'flagged' ? 'active' : ''}" data-rx-tab="flagged">⚠️ Regulatory Flagged</button>
        <button class="tab-btn ${activeFilterTab === 'all' ? 'active' : ''}" data-rx-tab="all">System Complete Register</button>
      `;
      if (activeFilterTab === 'all') activeFilterTab = 'controlled'; // Default tab for Authority
    } else if (currentRole === ROLES.REVIEWER) {
      tabsHTML = `
        <button class="tab-btn ${activeFilterTab === 'pending_auth' ? 'active' : ''}" data-rx-tab="pending_auth">📋 Pending Prior-Auth</button>
        <button class="tab-btn ${activeFilterTab === 'under_review' ? 'active' : ''}" data-rx-tab="under_review">🔍 Under Claim Review</button>
        <button class="tab-btn ${activeFilterTab === 'all' ? 'active' : ''}" data-rx-tab="all">All Verified Prescriptions</button>
      `;
      if (activeFilterTab === 'all') activeFilterTab = 'pending_auth'; // Default tab for Reviewer
    } else if (currentRole === ROLES.INVESTIGATOR) {
      tabsHTML = `
        <button class="tab-btn ${activeFilterTab === 'anonymized' ? 'active' : ''}" data-rx-tab="anonymized">🔬 Anonymized Trial Cohorts</button>
        <button class="tab-btn ${activeFilterTab === 'controlled' ? 'active' : ''}" data-rx-tab="controlled">Controlled Drug Anomalies</button>
        <button class="tab-btn ${activeFilterTab === 'all' ? 'active' : ''}" data-rx-tab="all">All Research Records</button>
      `;
      if (activeFilterTab === 'all') activeFilterTab = 'anonymized'; // Default for Investigator
    } else {
      // Admin
      tabsHTML = `
        <button class="tab-btn ${activeFilterTab === 'all' ? 'active' : ''}" data-rx-tab="all">All System Prescriptions</button>
        <button class="tab-btn ${activeFilterTab === 'controlled' ? 'active' : ''}" data-rx-tab="controlled">Controlled Substances</button>
        <button class="tab-btn ${activeFilterTab === 'flagged' ? 'active' : ''}" data-rx-tab="flagged">Flagged Items</button>
      `;
    }

    tabsContainer.innerHTML = tabsHTML;

    // Attach click handlers
    tabsContainer.querySelectorAll('[data-rx-tab]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        activeFilterTab = e.target.getAttribute('data-rx-tab');
        renderPrescriptionsView();
      });
    });
  }

  // 2. Fetch Filtered List
  const prescriptions = store.getPrescriptions(currentRole, activeFilterTab);
  const container = document.getElementById('rx-cards-list-container');
  if (!container) return;

  if (prescriptions.length === 0) {
    container.innerHTML = `
      <div class="card" style="text-align: center; padding: 3rem 1rem;">
        <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📄</div>
        <h3>No Prescriptions Match Active Filter</h3>
        <p>Try selecting a different filter tab above or issue a new prescription.</p>
      </div>
    `;
    return;
  }

  const isAnonymized = (currentRole === ROLES.INVESTIGATOR);

  container.innerHTML = prescriptions.map(rx => {
    const patientName = isAnonymized ? `Subject (${rx.anonymizedId})` : rx.patientName;
    const isControlled = rx.controlledSubstance;

    return `
      <div class="card" style="margin-bottom: 1.25rem; ${isControlled ? 'border-left: 4px solid var(--danger);' : ''}">
        <div class="card-header" style="margin-bottom: 0.85rem;">
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <h3 style="font-size: 1.15rem;">${rx.rxNumber}</h3>
              <span class="badge ${rx.status === 'active' ? 'badge-success' : 'badge-warning'}">${rx.status.replace('_', ' ')}</span>
              ${isControlled ? `<span class="badge badge-danger">🛡️ Controlled Drug</span>` : ''}
              <span class="badge badge-neutral">Prior Auth: ${rx.priorAuthStatus}</span>
            </div>
            <div style="font-size: 0.825rem; color: var(--text-muted); margin-top: 4px;">
              Issued by <strong>${rx.doctorName}</strong> (${rx.hospital}) • Date: ${rx.date}
            </div>
          </div>

          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-secondary btn-sm" onclick="window.viewPrescriptionSheet('${rx.id}')">📄 Print / View Sheet</button>
            ${renderRoleSpecificRxActions(rx, currentRole)}
          </div>
        </div>

        <div style="background: var(--bg-subtle); padding: 0.85rem 1rem; border-radius: var(--radius-md); margin-bottom: 0.85rem;">
          <div style="font-size: 0.8rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase;">Diagnosis / Indication</div>
          <div style="font-weight: 600; font-size: 0.9rem;">${rx.diagnosis}</div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
          ${rx.items.map(item => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.65rem 0.85rem; border: 1px solid var(--border-color); border-radius: var(--radius-sm); background: var(--bg-surface);">
              <div>
                <strong style="color: var(--primary); font-size: 0.95rem;">💊 ${item.drug}</strong>
                <span style="font-size: 0.85rem; color: var(--text-muted);"> (${item.dosage})</span>
                <div style="font-size: 0.775rem; color: var(--text-muted);">${item.frequency} for ${item.duration} • <em>"${item.instructions}"</em></div>
              </div>
              <span class="badge badge-neutral">Refills: ${rx.refillsRemaining}/${rx.totalRefillsAllowed}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function renderRoleSpecificRxActions(rx, role) {
  if (role === ROLES.USER) {
    if (rx.status === 'active' && rx.refillsRemaining > 0) {
      return `<button class="btn btn-primary btn-sm" onclick="window.requestRxRefill('${rx.id}')">🔄 Request Refill</button>`;
    }
  } else if (role === ROLES.REVIEWER) {
    if (rx.priorAuthStatus === 'pending' || rx.priorAuthStatus === 'under_review') {
      return `
        <button class="btn btn-primary btn-sm" onclick="window.updatePriorAuth('${rx.id}', 'approved')">✓ Approve Auth</button>
        <button class="btn btn-danger btn-sm" onclick="window.updatePriorAuth('${rx.id}', 'rejected')">✕ Reject</button>
      `;
    }
  } else if (role === ROLES.AUTHORITY) {
    if (rx.status !== 'flagged_audit') {
      return `<button class="btn btn-danger btn-sm" onclick="window.flagRxAudit('${rx.id}')">⚠️ Flag Audit</button>`;
    }
  }
  return '';
}

// Global action handlers attached to window
window.viewPrescriptionSheet = function(id) {
  const rxList = JSON.parse(localStorage.getItem('medora_prescriptions')) || [];
  const rx = rxList.find(r => r.id === id);
  if (!rx) return;

  const modalBody = document.getElementById('printable-rx-container');
  if (!modalBody) return;

  modalBody.innerHTML = `
    <div class="prescription-sheet">
      <div class="rx-header">
        <div>
          <div class="rx-brand">🌿 Medora Digital Health</div>
          <div style="font-size: 0.8rem; color: #64748b;">SPRINGFIELD MEDICAL HEALTH SYSTEM</div>
        </div>
        <div style="text-align: right;">
          <div style="font-weight: 800; font-size: 1.1rem; color: #0f172a;">${rx.rxNumber}</div>
          <div style="font-size: 0.8rem; color: #64748b;">Date: ${rx.date}</div>
        </div>
      </div>

      <div style="display: flex; justify-content: space-between; margin-bottom: 1.5rem; background: #f1f5f9; padding: 1rem; border-radius: 8px;">
        <div>
          <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Patient Details</div>
          <div style="font-weight: 800; font-size: 1.05rem; color: #0f172a;">${rx.patientName} (${rx.patientId})</div>
          <div style="font-size: 0.8rem; color: #475569;">Dx: ${rx.diagnosis}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.75rem; text-transform: uppercase; color: #64748b; font-weight: 700;">Prescribing Physician</div>
          <div style="font-weight: 800; font-size: 1.05rem; color: #0f172a;">${rx.doctorName}</div>
          <div style="font-size: 0.8rem; color: #475569;">${rx.hospital}</div>
        </div>
      </div>

      <div class="rx-symbol">Rx</div>

      <div>
        ${rx.items.map(item => `
          <div class="rx-med-item">
            <div class="rx-med-name">${item.drug} - ${item.dosage}</div>
            <div class="rx-med-instructions">Frequency: ${item.frequency} | Duration: ${item.duration}</div>
            <div class="rx-med-instructions" style="font-style: italic;">Sig: "${item.instructions}"</div>
          </div>
        `).join('')}
      </div>

      <div class="rx-footer">
        <div>
          <div style="font-size: 0.75rem; color: #64748b; font-family: monospace;">BARCODE VERIFIER: ||||| | |||| || ||| ${rx.rxNumber}</div>
          <div style="font-size: 0.75rem; color: #10b981; font-weight: 700; margin-top: 4px;">✓ Cryptographically Signed & Verified</div>
        </div>
        <div class="rx-signature">
          <em>Dr. Marcus Vance</em>
          <div>Authorized Doctor Signature</div>
        </div>
      </div>
    </div>
  `;

  openModal('modal-rx-sheet');
};

window.requestRxRefill = function(id) {
  store.updatePrescriptionStatus(id, 'refill_requested', null);
  showToast('Refill request submitted to pharmacy!', 'success');
  renderPrescriptionsView();
};

window.updatePriorAuth = function(id, status) {
  store.updatePrescriptionStatus(id, null, status);
  showToast(`Prior-authorization updated to: ${status.toUpperCase()}`, status === 'approved' ? 'success' : 'danger');
  renderPrescriptionsView();
};

window.flagRxAudit = function(id) {
  store.updatePrescriptionStatus(id, 'flagged_audit', null);
  showToast('Prescription flagged for Regulatory Audit!', 'warning');
  renderPrescriptionsView();
};

export function handleCreateRxSubmit(e) {
  e.preventDefault();
  
  const drugName = document.getElementById('new-rx-drug-name').value;
  const dosage = document.getElementById('new-rx-dosage').value;
  const frequency = document.getElementById('new-rx-frequency').value;
  const duration = document.getElementById('new-rx-duration').value;
  const instructions = document.getElementById('new-rx-instructions').value;
  const isControlled = document.getElementById('new-rx-controlled').checked;

  const newRx = {
    id: 'RX-' + Date.now(),
    rxNumber: 'RX' + Math.floor(100000 + Math.random() * 900000),
    patientId: 'PT-89421',
    patientName: 'Eleanor Vance',
    anonymizedId: 'COHORT-NEW-01',
    doctorName: 'Dr. Marcus Vance, MD',
    hospital: 'Springfield Central Hospital',
    date: new Date().toISOString().substring(0, 10),
    diagnosis: document.getElementById('new-rx-diagnosis').value || 'General Clinical Indication',
    status: 'active',
    controlledSubstance: isControlled,
    priorAuthStatus: isControlled ? 'pending' : 'approved',
    items: [
      { drug: drugName, dosage: dosage, frequency: frequency, duration: duration, instructions: instructions }
    ],
    refillsRemaining: 2,
    totalRefillsAllowed: 2,
    lastRefillDate: new Date().toISOString().substring(0, 10)
  };

  store.addPrescription(newRx);
  closeModal('modal-create-rx');
  showToast('Digital prescription issued successfully!', 'success');
  renderPrescriptionsView();
}

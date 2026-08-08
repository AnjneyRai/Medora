/**
 * Medora - Patient Profile View Controller
 * Privacy Masking & Editable Patient Card
 */

import { roleManager, ROLES } from './roles.js';
import { store } from './store.js';
import { showToast, openModal, closeModal } from './ui-utils.js';

export function renderPatientProfile() {
  const currentRole = roleManager.getRole();
  const patient = store.getPatient();
  const container = document.getElementById('patient-profile-card');

  if (!container) return;

  // Mask sensitive insurance/contact data for anonymized Investigator role
  const isAnonymized = (currentRole === ROLES.INVESTIGATOR);

  const displayId = isAnonymized ? 'COHORT-A-091' : patient.id;
  const displayName = isAnonymized ? 'Subject #091 (Anonymized)' : patient.name;
  const displayPhone = isAnonymized ? '***-***-****' : patient.phone;
  const displayEmail = isAnonymized ? 'anonymized@research.org' : patient.email;
  const displayPolicy = isAnonymized ? 'POLICY-HIDDEN' : patient.insurance.policyNumber;

  container.innerHTML = `
    <div class="card">
      <div style="display: flex; align-items: flex-start; justify-content: space-between; border-bottom: 1px solid var(--border-color); padding-bottom: 1.25rem; margin-bottom: 1.25rem;">
        <div style="display: flex; align-items: center; gap: 1.25rem;">
          <div style="width: 64px; height: 64px; border-radius: var(--radius-full); background: linear-gradient(135deg, var(--primary), var(--secondary)); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; font-weight: 800; box-shadow: var(--shadow-glow);">
            ${isAnonymized ? '🔬' : 'EV'}
          </div>
          <div>
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <h2 style="font-size: 1.4rem;">${displayName}</h2>
              <span class="badge badge-info">${displayId}</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); margin-top: 2px;">
              ${patient.age} Yrs Old • ${patient.gender} • Blood Group: <strong style="color: var(--danger);">${patient.bloodGroup}</strong>
            </div>
          </div>
        </div>

        ${!isAnonymized ? `
          <button class="btn btn-secondary btn-sm" id="btn-edit-patient-profile">✏️ Edit Profile</button>
        ` : `
          <span class="badge badge-warning">Anonymized Research Scope</span>
        `}
      </div>

      <div class="grid-cols-3">
        <div>
          <span class="form-label" style="color: var(--text-muted);">Email Address</span>
          <div style="font-weight: 700; font-size: 0.95rem;">${displayEmail}</div>
        </div>
        <div>
          <span class="form-label" style="color: var(--text-muted);">Contact Phone</span>
          <div style="font-weight: 700; font-size: 0.95rem;">${displayPhone}</div>
        </div>
        <div>
          <span class="form-label" style="color: var(--text-muted);">Primary Physician</span>
          <div style="font-weight: 700; font-size: 0.95rem; color: var(--primary);">${patient.primaryDoctor}</div>
        </div>
      </div>

      <div class="grid-cols-2" style="margin-top: 1rem;">
        <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md);">
          <div style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem;">Known Allergies</div>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            ${patient.allergies.map(a => `
              <span class="badge badge-danger">⚠️ ${a.name} (${a.severity})</span>
            `).join('')}
          </div>
        </div>

        <div style="background: var(--bg-subtle); padding: 1rem; border-radius: var(--radius-md);">
          <div style="font-weight: 700; font-size: 0.85rem; text-transform: uppercase; color: var(--text-muted); margin-bottom: 0.5rem;">Insurance Verification</div>
          <div style="font-weight: 700;">${patient.insurance.provider}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">Policy: ${displayPolicy} • <span style="color: var(--success); font-weight: 700;">${patient.insurance.status}</span></div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('btn-edit-patient-profile')?.addEventListener('click', () => {
    openModal('modal-edit-patient');
    // Pre-fill fields
    document.getElementById('edit-patient-name').value = patient.name;
    document.getElementById('edit-patient-phone').value = patient.phone;
    document.getElementById('edit-patient-address').value = patient.address;
  });
}

export function handlePatientFormSubmit(e) {
  e.preventDefault();
  const patient = store.getPatient();
  patient.name = document.getElementById('edit-patient-name').value;
  patient.phone = document.getElementById('edit-patient-phone').value;
  patient.address = document.getElementById('edit-patient-address').value;
  
  store.savePatient(patient);
  closeModal('modal-edit-patient');
  showToast('Patient profile updated successfully!', 'success');
  renderPatientProfile();
}

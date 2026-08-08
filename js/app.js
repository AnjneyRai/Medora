/**
 * Medora - Main Application Entry & Router Controller
 */

import { roleManager, ROLES } from './roles.js';
import { firebaseSync } from './firebase-config.js';
import { initTheme, initModalListeners, showToast, openModal, closeModal } from './ui-utils.js';
import { renderDashboard } from './dashboard.js';
import { renderPatientProfile, handlePatientFormSubmit } from './patient.js';
import { renderVitalsView, handleLogVitalSubmit } from './vitals.js';
import { renderPrescriptionsView, handleCreateRxSubmit } from './prescriptions.js';
import { renderMedicinesView, initMedicinesListeners } from './medicines.js';
import { renderAuditView } from './audit.js';

let activeView = 'dashboard';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Theme & Modals
  initTheme();
  initModalListeners();

  // 2. Initialize Firebase (if configured)
  firebaseSync.initFirebase();

  // 3. Render Navigation & Role Pills
  initRoleSwitcherUI();
  initNavigationRouter();

  // 4. Bind Form Listeners
  document.getElementById('form-edit-patient')?.addEventListener('submit', handlePatientFormSubmit);
  document.getElementById('form-log-vital')?.addEventListener('submit', handleLogVitalSubmit);
  document.getElementById('form-create-rx')?.addEventListener('submit', handleCreateRxSubmit);
  document.getElementById('form-firebase-config')?.addEventListener('submit', handleFirebaseConfigSubmit);

  // 5. Medicines Listeners
  initMedicinesListeners();

  // 6. Subscribe to Role Changes
  roleManager.subscribe((newRole, details) => {
    updateUIForRole(newRole, details);
    refreshActiveView();
    showToast(`Active perspective changed to: ${details.name}`, 'info');
  });

  // Initial view render
  refreshActiveView();
});

function initRoleSwitcherUI() {
  const container = document.getElementById('role-switcher-pills');
  if (!container) return;

  const currentRole = roleManager.getRole();

  container.innerHTML = Object.entries(ROLES).map(([key, roleValue]) => `
    <button class="role-pill ${currentRole === roleValue ? 'active' : ''}" data-role="${roleValue}">
      ${roleValue.toUpperCase()}
    </button>
  `).join('');

  container.querySelectorAll('[data-role]').forEach(pill => {
    pill.addEventListener('click', (e) => {
      const selectedRole = e.target.getAttribute('data-role');
      roleManager.setRole(selectedRole);
      
      container.querySelectorAll('.role-pill').forEach(p => p.classList.remove('active'));
      e.target.classList.add('active');
    });
  });

  updateUIForRole(currentRole, roleManager.getRoleDetails());
}

function updateUIForRole(role, details) {
  const userRoleText = document.getElementById('topbar-user-role-text');
  if (userRoleText) userRoleText.innerText = details.name;

  const createRxBtn = document.getElementById('nav-item-create-rx');
  if (createRxBtn) {
    if (role === ROLES.HOSPITAL || role === ROLES.ADMIN) {
      createRxBtn.style.display = 'flex';
    } else {
      createRxBtn.style.display = 'none';
    }
  }
}

function initNavigationRouter() {
  document.querySelectorAll('[data-view]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const targetView = item.getAttribute('data-view');
      
      document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
      document.querySelectorAll(`[data-view="${targetView}"]`).forEach(nav => nav.classList.add('active'));

      activeView = targetView;
      refreshActiveView();

      // Close mobile drawer if open
      document.getElementById('sidebar')?.classList.remove('open');
    });
  });

  document.getElementById('mobile-menu-toggle')?.addEventListener('click', () => {
    document.getElementById('sidebar')?.classList.toggle('open');
  });

  document.getElementById('firebase-status-widget')?.addEventListener('click', () => {
    openModal('modal-firebase-settings');
  });
}

function refreshActiveView() {
  document.querySelectorAll('.view-panel').forEach(panel => panel.classList.remove('active'));
  
  const activePanel = document.getElementById(`view-${activeView}`);
  if (activePanel) {
    activePanel.classList.add('active');
  }

  // Render view specific logic
  switch (activeView) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'patient':
      renderPatientProfile();
      break;
    case 'vitals':
      renderVitalsView();
      break;
    case 'prescriptions':
      renderPrescriptionsView();
      break;
    case 'medicines':
      renderMedicinesView();
      break;
    case 'audit':
      renderAuditView();
      break;
  }
}

function handleFirebaseConfigSubmit(e) {
  e.preventDefault();
  const config = {
    apiKey: document.getElementById('fb-api-key').value,
    authDomain: document.getElementById('fb-auth-domain').value,
    projectId: document.getElementById('fb-project-id').value,
    storageBucket: document.getElementById('fb-storage-bucket').value,
    appId: document.getElementById('fb-app-id').value
  };

  firebaseSync.saveConfig(config);
  closeModal('modal-firebase-settings');
  showToast('Firebase configuration updated!', 'success');
}

/**
 * Medora - Dashboard View Controller
 * Contextual Stats & Role-Aware Widgets
 */

import { roleManager, ROLE_DETAILS, ROLES } from './roles.js';
import { store } from './store.js';
import { openModal } from './ui-utils.js';

export function renderDashboard() {
  const currentRole = roleManager.getRole();
  const roleDetails = roleManager.getRoleDetails();
  
  // 1. Render Scope Banner
  const scopeBanner = document.getElementById('dashboard-scope-banner');
  if (scopeBanner) {
    scopeBanner.innerHTML = `
      <div>
        <div class="scope-title">
          <span>${roleDetails.icon}</span> Active Perspective: ${roleDetails.name}
          <span class="badge ${roleDetails.badgeClass}">${currentRole.toUpperCase()}</span>
        </div>
        <div class="scope-desc">${roleDetails.description}</div>
      </div>
      <div>
        <button class="btn btn-secondary btn-sm" id="btn-quick-switch-role">Switch Role Context</button>
      </div>
    `;

    document.getElementById('btn-quick-switch-role')?.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. Render Stat Widgets Contextually
  const statsContainer = document.getElementById('dashboard-stats-grid');
  if (statsContainer) {
    const rxList = store.getPrescriptions(currentRole, 'all');
    const vitals = store.getVitals();
    const patient = store.getPatient();

    let statsHTML = '';

    if (currentRole === ROLES.USER) {
      statsHTML = `
        <div class="stat-widget">
          <div class="stat-icon">💊</div>
          <div class="stat-info">
            <span class="stat-label">Active Prescriptions</span>
            <span class="stat-value">${rxList.filter(r => r.status === 'active').length}</span>
            <span class="stat-subtext">2 Refills Remaining</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--secondary-light); color: var(--secondary);">❤️</div>
          <div class="stat-info">
            <span class="stat-label">Latest BP Vitals</span>
            <span class="stat-value">${vitals[0]?.bpSystolic || 120}/${vitals[0]?.bpDiastolic || 80}</span>
            <span class="stat-subtext">Optimal Target</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--warning-light); color: var(--warning);">⏰</div>
          <div class="stat-info">
            <span class="stat-label">Next Scheduled Dose</span>
            <span class="stat-value">13:00</span>
            <span class="stat-subtext warning">Metformin 500mg</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--accent-light); color: var(--accent);">👨‍⚕️</div>
          <div class="stat-info">
            <span class="stat-label">Primary Physician</span>
            <span class="stat-value" style="font-size: 1.1rem; margin-top: 6px;">${patient.primaryDoctor}</span>
            <span class="stat-subtext">Springfield Health</span>
          </div>
        </div>
      `;
    } else if (currentRole === ROLES.HOSPITAL) {
      statsHTML = `
        <div class="stat-widget">
          <div class="stat-icon">🩺</div>
          <div class="stat-info">
            <span class="stat-label">Active Triage Queue</span>
            <span class="stat-value">14 Patients</span>
            <span class="stat-subtext">3 High Priority</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--secondary-light); color: var(--secondary);">📝</div>
          <div class="stat-info">
            <span class="stat-label">Issued Prescriptions</span>
            <span class="stat-value">48 Today</span>
            <span class="stat-subtext">+12% vs last shift</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--warning-light); color: var(--warning);">🛏️</div>
          <div class="stat-info">
            <span class="stat-label">Ward Occupancy</span>
            <span class="stat-value">82%</span>
            <span class="stat-subtext warning">18 Beds Available</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--danger-light); color: var(--danger);">🔬</div>
          <div class="stat-info">
            <span class="stat-label">Pending Lab Reports</span>
            <span class="stat-value">6 Urgent</span>
            <span class="stat-subtext danger">Blood Work / Stats</span>
          </div>
        </div>
      `;
    } else if (currentRole === ROLES.AUTHORITY) {
      statsHTML = `
        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--danger-light); color: var(--danger);">🛡️</div>
          <div class="stat-info">
            <span class="stat-label">Controlled Drug Audits</span>
            <span class="stat-value">1 Active Flag</span>
            <span class="stat-subtext danger">Morphine / Alprazolam</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon">🏛️</div>
          <div class="stat-info">
            <span class="stat-label">Licensed Facilities</span>
            <span class="stat-value">128 Total</span>
            <span class="stat-subtext">100% Compliant</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--secondary-light); color: var(--secondary);">📈</div>
          <div class="stat-info">
            <span class="stat-label">Regional Disease Index</span>
            <span class="stat-value">Normal</span>
            <span class="stat-subtext">No Outbreak Alert</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--accent-light); color: var(--accent);">📊</div>
          <div class="stat-info">
            <span class="stat-label">Regulatory Filings</span>
            <span class="stat-value">99.4%</span>
            <span class="stat-subtext">On Time Submission</span>
          </div>
        </div>
      `;
    } else if (currentRole === ROLES.REVIEWER) {
      statsHTML = `
        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--warning-light); color: var(--warning);">📋</div>
          <div class="stat-info">
            <span class="stat-label">Prior-Auth Queue</span>
            <span class="stat-value">2 Pending</span>
            <span class="stat-subtext warning">Action Required</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon">✅</div>
          <div class="stat-info">
            <span class="stat-label">Claims Verified</span>
            <span class="stat-value">1,420</span>
            <span class="stat-subtext">98.2% Approval Rate</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--secondary-light); color: var(--secondary);">⏱️</div>
          <div class="stat-info">
            <span class="stat-label">Avg Review Time</span>
            <span class="stat-value">1.4 Hrs</span>
            <span class="stat-subtext">Within Target SLA</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--danger-light); color: var(--danger);">🚫</div>
          <div class="stat-info">
            <span class="stat-label">Rejected / Returned</span>
            <span class="stat-value">18 This Month</span>
            <span class="stat-subtext danger">Incomplete Dx Codes</span>
          </div>
        </div>
      `;
    } else if (currentRole === ROLES.INVESTIGATOR) {
      statsHTML = `
        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--secondary-light); color: var(--secondary);">🔍</div>
          <div class="stat-info">
            <span class="stat-label">Anonymized Cohorts</span>
            <span class="stat-value">34 Cohorts</span>
            <span class="stat-subtext">12,400 Records</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--warning-light); color: var(--warning);">⚠️</div>
          <div class="stat-info">
            <span class="stat-label">ADR Event Reports</span>
            <span class="stat-value">4 Logged</span>
            <span class="stat-subtext warning">Under Research</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon">🧬</div>
          <div class="stat-info">
            <span class="stat-label">Active Trial Studies</span>
            <span class="stat-value">8 Projects</span>
            <span class="stat-subtext">Phase II / III</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--accent-light); color: var(--accent);">📤</div>
          <div class="stat-info">
            <span class="stat-label">Dataset Exports</span>
            <span class="stat-value">14 JSON/CSV</span>
            <span class="stat-subtext">Audit Tracked</span>
          </div>
        </div>
      `;
    } else {
      // Admin
      statsHTML = `
        <div class="stat-widget">
          <div class="stat-icon">⚙️</div>
          <div class="stat-info">
            <span class="stat-label">Registered Users</span>
            <span class="stat-value">3,890</span>
            <span class="stat-subtext">Global System</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--secondary-light); color: var(--secondary);">☁️</div>
          <div class="stat-info">
            <span class="stat-label">Sync Status</span>
            <span class="stat-value">Healthy</span>
            <span class="stat-subtext">0 Latency Delay</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--accent-light); color: var(--accent);">🔒</div>
          <div class="stat-info">
            <span class="stat-label">Security Audits</span>
            <span class="stat-value">100% Clean</span>
            <span class="stat-subtext">Zero Breach Flags</span>
          </div>
        </div>

        <div class="stat-widget">
          <div class="stat-icon" style="background: var(--warning-light); color: var(--warning);">📁</div>
          <div class="stat-info">
            <span class="stat-label">Total System RX</span>
            <span class="stat-value">${rxList.length} Records</span>
            <span class="stat-subtext">Indexed DB</span>
          </div>
        </div>
      `;
    }

    statsContainer.innerHTML = statsHTML;
  }

  // 3. Render Quick Actions Toolbar
  const quickActionsContainer = document.getElementById('dashboard-quick-actions');
  if (quickActionsContainer) {
    if (currentRole === ROLES.HOSPITAL || currentRole === ROLES.ADMIN) {
      quickActionsContainer.innerHTML = `
        <button class="btn btn-primary" id="dash-btn-new-rx">➕ Issue Digital Prescription</button>
        <button class="btn btn-secondary" id="dash-btn-log-vital">📊 Log Patient Vitals</button>
      `;
      document.getElementById('dash-btn-new-rx')?.addEventListener('click', () => openModal('modal-create-rx'));
      document.getElementById('dash-btn-log-vital')?.addEventListener('click', () => openModal('modal-log-vital'));
    } else if (currentRole === ROLES.USER) {
      quickActionsContainer.innerHTML = `
        <button class="btn btn-primary" id="dash-btn-log-vital">📊 Log Today's Vitals</button>
        <button class="btn btn-secondary" id="dash-btn-request-refill">🔄 Request RX Refill</button>
      `;
      document.getElementById('dash-btn-log-vital')?.addEventListener('click', () => openModal('modal-log-vital'));
      document.getElementById('dash-btn-request-refill')?.addEventListener('click', () => {
        document.querySelector('[data-view="prescriptions"]').click();
      });
    } else {
      quickActionsContainer.innerHTML = `
        <button class="btn btn-secondary" id="dash-btn-export-audit">📥 Export Audit Report</button>
      `;
      document.getElementById('dash-btn-export-audit')?.addEventListener('click', () => {
        document.querySelector('[data-view="audit"]').click();
      });
    }
  }

  // 4. Render Daily Dose Checklist
  const doseChecklist = document.getElementById('dose-checklist');
  if (doseChecklist) {
    doseChecklist.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <input type="checkbox" checked style="width: 18px; height: 18px; accent-color: var(--primary);">
          <div>
            <div style="font-weight: 700; font-size: 0.9rem;">Metformin Hydrochloride 500mg</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Morning Dose - Taken at 08:15 AM</div>
          </div>
        </div>
        <span class="badge badge-success">Completed</span>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color);">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <input type="checkbox" style="width: 18px; height: 18px; accent-color: var(--primary);">
          <div>
            <div style="font-weight: 700; font-size: 0.9rem;">Lisinopril 10mg</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Afternoon Dose - Scheduled 13:00</div>
          </div>
        </div>
        <span class="badge badge-warning">Upcoming</span>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.75rem 0;">
        <div style="display: flex; align-items: center; gap: 0.75rem;">
          <input type="checkbox" style="width: 18px; height: 18px; accent-color: var(--primary);">
          <div>
            <div style="font-weight: 700; font-size: 0.9rem;">Amoxicillin / Clavulanate 875mg</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Evening Dose - Scheduled 20:00</div>
          </div>
        </div>
        <span class="badge badge-neutral">Scheduled</span>
      </div>
    `;
  }
}

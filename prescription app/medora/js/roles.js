/**
 * Medora - Role & RBAC Management System
 * Stakeholders: User (Patient), Hospital, Authority, Investigator, Reviewer, Admin
 */

export const ROLES = {
  USER: 'user',                 // Patient View
  HOSPITAL: 'hospital',         // Doctor / Care Team View
  AUTHORITY: 'authority',       // Regulatory & Govt Health Board View
  INVESTIGATOR: 'investigator', // Research & Anomaly Auditor View
  REVIEWER: 'reviewer',         // Insurance & Claims Approver View
  ADMIN: 'admin'                // Superuser System View
};

export const ROLE_DETAILS = {
  [ROLES.USER]: {
    name: 'User (Patient)',
    icon: '👤',
    badgeClass: 'badge-neutral',
    description: 'Viewing personal health records, active prescriptions, daily vitals, and refill requests.',
    permissions: ['VIEW_OWN_PRESCRIPTIONS', 'LOG_VITALS', 'REQUEST_REFILL', 'VIEW_PATIENT_PROFILE']
  },
  [ROLES.HOSPITAL]: {
    name: 'Hospital / Care Team',
    icon: '🏥',
    badgeClass: 'badge-info',
    description: 'Viewing clinical triage queue, active patient charts, issuing digital prescriptions, and doctor notes.',
    permissions: ['VIEW_ALL_PATIENTS', 'CREATE_PRESCRIPTION', 'UPDATE_VITALS', 'ISSUE_LAB_ORDERS', 'VIEW_CLINICAL_QUEUE']
  },
  [ROLES.AUTHORITY]: {
    name: 'Health Authority',
    icon: '🛡️',
    badgeClass: 'badge-danger',
    description: 'Auditing controlled substance prescriptions, facility compliance, epidemic alerts, and regulatory logs.',
    permissions: ['AUDIT_CONTROLLED_DRUGS', 'VIEW_REGULATORY_LOGS', 'VIEW_COMPLIANCE_METRICS', 'FLAG_VIOLATIONS']
  },
  [ROLES.INVESTIGATOR]: {
    name: 'Investigator / Researcher',
    icon: '🔍',
    badgeClass: 'badge-warning',
    description: 'Analyzing anonymized clinical cohorts, adverse drug reactions, and prescription anomaly spikes.',
    permissions: ['VIEW_ANONYMIZED_COHORTS', 'VIEW_ADR_REPORTS', 'EXPORT_RESEARCH_DATA', 'FLAG_PRESCRIPTION_ANOMALY']
  },
  [ROLES.REVIEWER]: {
    name: 'Reviewer (Insurance/Claims)',
    icon: '📋',
    badgeClass: 'badge-success',
    description: 'Managing prior-authorization queues, verifying pharmacy claims, and reviewing prescription authenticity.',
    permissions: ['VIEW_PRIOR_AUTH_QUEUE', 'APPROVE_CLAIMS', 'REJECT_CLAIMS', 'VERIFY_RX_AUTHENTICITY']
  },
  [ROLES.ADMIN]: {
    name: 'System Admin',
    icon: '⚙️',
    badgeClass: 'badge-neutral',
    description: 'Full system visibility, user access management, database sync status, and security audit logs.',
    permissions: ['ALL_PERMISSIONS', 'MANAGE_USERS', 'CONFIGURE_FIREBASE', 'VIEW_SECURITY_LOGS']
  }
};

class RoleManager {
  constructor() {
    this.currentRole = localStorage.getItem('medora_active_role') || ROLES.USER;
    this.listeners = [];
  }

  getRole() {
    return this.currentRole;
  }

  getRoleDetails() {
    return ROLE_DETAILS[this.currentRole] || ROLE_DETAILS[ROLES.USER];
  }

  setRole(newRole) {
    if (!Object.values(ROLES).includes(newRole)) return;
    this.currentRole = newRole;
    localStorage.setItem('medora_active_role', newRole);
    this.notifyListeners(newRole);
  }

  hasPermission(permission) {
    if (this.currentRole === ROLES.ADMIN) return true;
    const permissions = this.getRoleDetails().permissions || [];
    return permissions.includes(permission);
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }

  notifyListeners(role) {
    this.listeners.forEach(cb => cb(role, ROLE_DETAILS[role]));
  }
}

export const roleManager = new RoleManager();

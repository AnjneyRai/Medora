/**
 * Medora - Audit & Compliance Logs Controller
 * Security Logs & Anonymized Dataset Exporter
 */

import { store } from './store.js';
import { showToast } from './ui-utils.js';

export function renderAuditView() {
  const logs = store.getAuditLogs();
  const container = document.getElementById('audit-logs-table-body');

  if (!container) return;

  container.innerHTML = logs.map(l => `
    <tr>
      <td><code>${l.id}</code></td>
      <td>${l.timestamp}</td>
      <td><strong>${l.actor}</strong></td>
      <td>${l.action}</td>
      <td><span class="badge badge-neutral">${l.role.toUpperCase()}</span></td>
    </tr>
  `).join('');

  document.getElementById('btn-export-json-audit')?.addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `medora_audit_export_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Audit log dataset exported (JSON)', 'success');
  });
}

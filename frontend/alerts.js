const BASE = 'http://localhost:5000/api';

// Check login
const user = JSON.parse(localStorage.getItem('loggedInUser'));
if (!user) window.location.href = 'index.html';

// Show welcome
document.getElementById('welcomeUser').textContent = user.username;

// Logout
function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
}

// Store all alerts globally for filtering
let allAlerts = [];

// Load alerts
async function loadAlerts() {
  try {
    const res = await fetch(`${BASE}/alerts`);
    allAlerts = await res.json();

    // Update stats
    document.getElementById('totalAlerts').textContent = allAlerts.length;
    document.getElementById('criticalCount').textContent = allAlerts.filter(a => a.severity === 'Critical' && !a.resolved).length;
    document.getElementById('warningCount').textContent = allAlerts.filter(a => a.severity === 'Warning' && !a.resolved).length;
    document.getElementById('resolvedCount').textContent = allAlerts.filter(a => a.resolved).length;

    // Show all by default
    renderAlerts(allAlerts);

  } catch (err) {
    console.error('Error loading alerts:', err);
  }
}

// Render alerts
function renderAlerts(alerts) {
  const container = document.getElementById('alertsList');

  if (alerts.length === 0) {
    container.innerHTML = '<p style="color:#94a3b8; font-size:13px; padding:20px;">No alerts found</p>';
    return;
  }

  container.innerHTML = alerts.map(a => `
    <div style="padding:16px; border-radius:10px; margin-bottom:12px;
      background:${a.resolved ? '#f0fdf4' : a.severity === 'Critical' ? '#fee2e2' : '#fef9c3'};
      border:1px solid ${a.resolved ? '#bbf7d0' : a.severity === 'Critical' ? '#fecaca' : '#fef08a'};">
      <div style="display:flex; justify-content:space-between; align-items:start;">
        <div>
          <p style="font-size:13px; font-weight:600;
            color:${a.resolved ? '#166534' : a.severity === 'Critical' ? '#991b1b' : '#854d0e'};
            margin-bottom:4px;">
            ${a.resolved ? '✅' : a.severity === 'Critical' ? '🚨' : '⚠️'}
            ${a.severity} — ${a.medicineName} (Batch: ${a.batchNumber})
          </p>
          <p style="font-size:12px; color:#64748b; margin-bottom:4px;">${a.message}</p>
          <p style="font-size:11px; color:#94a3b8;">
            ${new Date(a.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <span class="${a.resolved ? 'badge-pass' : 'badge-fail'}">
            ${a.resolved ? 'Resolved' : 'Active'}
          </span>
          ${!a.resolved ? `
            <button class="btn-secondary" onclick="resolveAlert('${a._id}')"
              style="background:#166534; color:white; border:none; padding:6px 12px;
              border-radius:6px; font-size:12px; cursor:pointer;">
              Mark Resolved
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

// Filter alerts
function filterAlerts(type) {
  // Update button styles
  const buttons = ['btnAll', 'btnCritical', 'btnWarning', 'btnResolved'];
  const colors = {
    btnAll: '#0c447c',
    btnCritical: '#991b1b',
    btnWarning: '#854d0e',
    btnResolved: '#166534'
  };

  buttons.forEach(btn => {
    const el = document.getElementById(btn);
    const color = colors[btn];
    el.style.background = 'white';
    el.style.color = color;
  });

  // Highlight active button
  const activeBtn = type === 'all' ? 'btnAll' :
                    type === 'Critical' ? 'btnCritical' :
                    type === 'Warning' ? 'btnWarning' : 'btnResolved';

  document.getElementById(activeBtn).style.background = colors[activeBtn];
  document.getElementById(activeBtn).style.color = 'white';

  // Filter
  let filtered = allAlerts;
  if (type === 'Critical') filtered = allAlerts.filter(a => a.severity === 'Critical' && !a.resolved);
  else if (type === 'Warning') filtered = allAlerts.filter(a => a.severity === 'Warning' && !a.resolved);
  else if (type === 'Resolved') filtered = allAlerts.filter(a => a.resolved);

  renderAlerts(filtered);
}

// Resolve alert
async function resolveAlert(id) {
  if (!confirm('Mark this alert as resolved?')) return;
  try {
    const res = await fetch(`${BASE}/alerts/${id}/resolve`, {
      method: 'PATCH'
    });
    if (res.ok) {
      alert('Alert marked as resolved!');
      loadAlerts();
    }
  } catch (err) {
    console.error('Error resolving alert:', err);
  }
}

// Init AOS
AOS.init({ duration: 600, once: true });

loadAlerts();
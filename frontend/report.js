const BASE = 'http://localhost:5000/api';

// Check login
const user = JSON.parse(localStorage.getItem('loggedInUser'));
if (!user) window.location.href = 'index.html';

// Show welcome
document.getElementById('welcomeUser').textContent = user.username;

// Set report date
document.getElementById('reportDate').textContent = `Generated on: ${new Date().toLocaleDateString('en-IN', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})}`;

// Logout
function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
}

async function loadReport() {
  try {
    const [meds, consumables, tests, alerts] = await Promise.all([
      fetch(`${BASE}/medicines`).then(r => r.json()),
      fetch(`${BASE}/consumables`).then(r => r.json()),
      fetch(`${BASE}/test-results`).then(r => r.json()),
      fetch(`${BASE}/alerts`).then(r => r.json())
    ]);

    // Stats
    const passed = tests.filter(t => t.status === 'Pass').length;
    const failed = tests.filter(t => t.status === 'Fail').length;

    document.getElementById('totalMedicines').textContent = meds.length;
    document.getElementById('totalConsumables').textContent = consumables.length;
    document.getElementById('totalPassed').textContent = passed;
    document.getElementById('totalFailed').textContent = failed;

    // Medicines table
    document.getElementById('medicinesTable').innerHTML = meds.length === 0
      ? '<tr><td colspan="4" style="text-align:center; color:#94a3b8;">No medicines found</td></tr>'
      : meds.map(m => `
        <tr>
          <td>${m.name}</td>
          <td>${m.batchNumber}</td>
          <td>${m.manufacturer}</td>
          <td>${new Date(m.expiryDate).toLocaleDateString()}</td>
        </tr>
      `).join('');

    // Consumables table
    document.getElementById('consumablesTable').innerHTML = consumables.length === 0
      ? '<tr><td colspan="5" style="text-align:center; color:#94a3b8;">No consumables found</td></tr>'
      : consumables.map(c => `
        <tr>
          <td>${c.name}</td>
          <td>${c.category}</td>
          <td>${c.quantity} ${c.unit}</td>
          <td>${c.supplier}</td>
          <td>
            <span class="badge-${c.status === 'Available' ? 'pass' : c.status === 'Low Stock' ? 'warning' : 'fail'}">
              ${c.status}
            </span>
          </td>
        </tr>
      `).join('');

    // Test results table
    document.getElementById('testResultsTable').innerHTML = tests.length === 0
      ? '<tr><td colspan="5" style="text-align:center; color:#94a3b8;">No test results found</td></tr>'
      : tests.map(t => {
          const isMedicine = t.testType === 'Medicine';
          const name = isMedicine ? t.medicineName : t.consumableName;
          const details = isMedicine
            ? `Purity: ${t.purity}% | pH: ${t.pH}`
            : `Condition: ${t.condition}`;
          return `
            <tr>
              <td>
                ${isMedicine
                  ? `<span style="background:#e0f2fe; color:#0c447c; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600;">Medicine</span>`
                  : `<span style="background:#dcfce7; color:#166534; padding:3px 10px; border-radius:20px; font-size:11px; font-weight:600;">Consumable</span>`
                }
              </td>
              <td>${name || '-'}</td>
              <td>${details}</td>
              <td>${new Date(t.testDate).toLocaleDateString()}</td>
              <td>
                <span class="badge-${t.status === 'Pass' ? 'pass' : 'fail'}">
                  ${t.status}
                </span>
              </td>
            </tr>
          `;
        }).join('');

    // Alerts table
    document.getElementById('alertsTable').innerHTML = alerts.length === 0
      ? '<tr><td colspan="5" style="text-align:center; color:#94a3b8;">No alerts found</td></tr>'
      : alerts.map(a => `
        <tr>
          <td>${a.medicineName} (${a.batchNumber})</td>
          <td>${a.message}</td>
          <td>
            <span class="${a.severity === 'Critical' ? 'badge-fail' : 'badge-warning'}">
              ${a.severity}
            </span>
          </td>
          <td>${new Date(a.createdAt).toLocaleDateString()}</td>
          <td>
            <span class="${a.resolved ? 'badge-pass' : 'badge-fail'}">
              ${a.resolved ? 'Resolved' : 'Active'}
            </span>
          </td>
        </tr>
      `).join('');

  } catch (err) {
    console.error('Report error:', err);
  }
}

loadReport();
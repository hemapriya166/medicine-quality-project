const BASE = 'http://localhost:5000/api';

const user = JSON.parse(localStorage.getItem('loggedInUser'));
if (!user) window.location.href = 'index.html';

document.getElementById('welcomeUser').textContent = user.username;

function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
}

let doughnutChart = null;
let barChart = null;

async function loadDashboard() {
  try {
    const [meds, consumables, tests, alerts] = await Promise.all([
      fetch(`${BASE}/medicines`).then(r => r.json()),
      fetch(`${BASE}/consumables`).then(r => r.json()),
      fetch(`${BASE}/test-results`).then(r => r.json()),
      fetch(`${BASE}/alerts`).then(r => r.json())
    ]);

    const passed = tests.filter(t => t.status === 'Pass').length;
    const failed = tests.filter(t => t.status === 'Fail').length;
    const activeAlerts = alerts.filter(a => !a.resolved).length;
    const totalItems = meds.length + consumables.length;

    document.getElementById('totalMedicines').textContent = totalItems;
    document.getElementById('totalPassed').textContent = passed;
    document.getElementById('totalFailed').textContent = failed;
    document.getElementById('totalAlerts').textContent = activeAlerts;

    // Doughnut chart
    const doughnutCtx = document.getElementById('doughnutChart').getContext('2d');
    if (doughnutChart) doughnutChart.destroy();

    if (passed === 0 && failed === 0) {
      document.getElementById('doughnutChart').parentElement.innerHTML +=
        '<p style="text-align:center; color:#94a3b8; font-size:13px; margin-top:60px;">No test data yet</p>';
    } else {
      doughnutChart = new Chart(doughnutCtx, {
        type: 'doughnut',
        data: {
          labels: ['Pass', 'Fail'],
          datasets: [{
            data: [passed, failed],
            backgroundColor: ['#0c447c', '#e2e8f0'],
            borderColor: ['#0a3a6b', '#cbd5e1'],
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: {
            legend: {
              position: 'bottom',
              labels: { font: { size: 12 }, padding: 20 }
            }
          }
        }
      });
    }

    // Bar chart
    const monthlyData = {};
    tests.forEach(t => {
      const month = new Date(t.testDate).toLocaleString('default', { month: 'short' });
      if (!monthlyData[month]) monthlyData[month] = { Pass: 0, Fail: 0 };
      monthlyData[month][t.status]++;
    });

    const months = Object.keys(monthlyData);
    const barCtx = document.getElementById('barChart').getContext('2d');
    if (barChart) barChart.destroy();

    if (months.length === 0) {
      document.getElementById('barChart').parentElement.innerHTML +=
        '<p style="text-align:center; color:#94a3b8; font-size:13px; margin-top:60px;">No test data yet</p>';
    } else {
      barChart = new Chart(barCtx, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Pass',
              data: months.map(m => monthlyData[m].Pass),
              backgroundColor: '#0c447c',
              borderColor: '#0a3a6b',
              borderWidth: 2
            },
            {
              label: 'Fail',
              data: months.map(m => monthlyData[m].Fail),
              backgroundColor: '#94a3b8',
              borderColor: '#64748b',
              borderWidth: 2
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'bottom',
              labels: { font: { size: 12 }, padding: 20 }
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: { color: '#f1f5f9' },
              ticks: { stepSize: 1 }
            },
            x: { grid: { display: false } }
          }
        }
      });
    }

    // Recent tests
    const tbody = document.getElementById('recentTestsTable');
    if (tests.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:#94a3b8;">No test results yet</td></tr>';
    } else {
      tbody.innerHTML = tests.slice(0, 5).map(t => {
        const isMedicine = t.testType === 'Medicine';
        const name = isMedicine ? t.medicineName : t.consumableName;
        const batchOrCategory = isMedicine ? t.batchNumber : t.category;
        const details = isMedicine
          ? `Purity: ${t.purity}% | pH: ${t.pH}`
          : `Condition: ${t.condition}`;
        return `
          <tr>
            <td>${name || '-'}</td>
            <td>${batchOrCategory || '-'}</td>
            <td>${details}</td>
            <td>${new Date(t.testDate).toLocaleDateString()}</td>
            <td><span class="badge-${t.status === 'Pass' ? 'pass' : 'fail'}">${t.status}</span></td>
          </tr>
        `;
      }).join('');
    }

    // Active alerts
    const alertsList = document.getElementById('alertsList');
    const activeAlertsList = alerts.filter(a => !a.resolved);
    if (activeAlertsList.length === 0) {
      alertsList.innerHTML = '<p style="color:#94a3b8; font-size:13px;">No active alerts</p>';
    } else {
      alertsList.innerHTML = activeAlertsList.map(a => `
        <div style="padding:12px; border-radius:8px; margin-bottom:10px;
          background:${a.severity === 'Critical' ? '#fee2e2' : '#fef9c3'};
          border:1px solid ${a.severity === 'Critical' ? '#fecaca' : '#fef08a'};">
          <p style="font-size:13px; font-weight:600;
            color:${a.severity === 'Critical' ? '#991b1b' : '#854d0e'};">
            ${a.severity === 'Critical' ? '🚨' : '⚠️'} ${a.severity} — ${a.medicineName} (Batch: ${a.batchNumber})
          </p>
          <p style="font-size:12px; color:#64748b; margin-top:4px;">${a.message}</p>
        </div>
      `).join('');
    }

    AOS.init({ duration: 600, once: true });

  } catch (err) {
    console.error('Dashboard error:', err);
  }
}

loadDashboard();
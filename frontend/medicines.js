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

// Show/hide form
function showAddForm() {
  document.getElementById('addForm').style.display = 'block';
}

function hideAddForm() {
  document.getElementById('addForm').style.display = 'none';
}

// Load medicines
async function loadMedicines() {
  try {
    const res = await fetch(`${BASE}/medicines`);
    const medicines = await res.json();

    const today = new Date();
    const thirtyDaysLater = new Date();
    thirtyDaysLater.setDate(today.getDate() + 30);

    let expiringSoon = 0;
    let expired = 0;
    let active = 0;

    const tbody = document.getElementById('medicinesTable');

    if (medicines.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; color:#94a3b8;">No medicines added yet</td></tr>';
      document.getElementById('totalMedicines').textContent = 0;
      document.getElementById('expiringSoon').textContent = 0;
      document.getElementById('expired').textContent = 0;
      document.getElementById('active').textContent = 0;
      return;
    }

    tbody.innerHTML = medicines.map(m => {
      const expiry = new Date(m.expiryDate);
      let statusBadge = '';

      if (expiry < today) {
        expired++;
        statusBadge = '<span class="badge-fail">Expired</span>';
      } else if (expiry <= thirtyDaysLater) {
        expiringSoon++;
        statusBadge = '<span class="badge-warning">Expiring Soon</span>';
      } else {
        active++;
        statusBadge = '<span class="badge-pass">Active</span>';
      }

      return `
        <tr>
          <td>${m.name}</td>
          <td>${m.batchNumber}</td>
          <td>${m.manufacturer}</td>
          <td>${expiry.toLocaleDateString()}</td>
          <td>${statusBadge}</td>
          <td>
            <button class="btn-danger" onclick="deleteMedicine('${m._id}')">Delete</button>
          </td>
        </tr>
      `;
    }).join('');

    document.getElementById('totalMedicines').textContent = medicines.length;
    document.getElementById('expiringSoon').textContent = expiringSoon;
    document.getElementById('expired').textContent = expired;
    document.getElementById('active').textContent = active;

  } catch (err) {
    console.error('Error loading medicines:', err);
  }
}

// Add medicine
async function addMedicine() {
  const name = document.getElementById('medName').value;
  const batchNumber = document.getElementById('medBatch').value;
  const manufacturer = document.getElementById('medManufacturer').value;
  const expiryDate = document.getElementById('medExpiry').value;

  if (!name || !batchNumber || !manufacturer || !expiryDate) {
    alert('Please fill all fields!');
    return;
  }

  try {
    const res = await fetch(`${BASE}/medicines`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, batchNumber, manufacturer, expiryDate })
    });

    if (res.ok) {
      alert('Medicine added successfully!');
      hideAddForm();
      loadMedicines();
    } else {
      const data = await res.json();
      alert(data.error || 'Something went wrong');
    }
  } catch (err) {
    console.error('Error adding medicine:', err);
    alert('Could not connect to server!');
  }
}

// Delete medicine
async function deleteMedicine(id) {
  if (!confirm('Are you sure you want to delete this medicine?')) return;
  try {
    const res = await fetch(`${BASE}/medicines/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      alert('Medicine deleted!');
      loadMedicines();
    }
  } catch (err) {
    console.error('Error deleting medicine:', err);
  }
}

// Init AOS
AOS.init({ duration: 600, once: true });

loadMedicines();
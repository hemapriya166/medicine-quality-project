const BASE = 'http://localhost:5000/api';

const user = JSON.parse(localStorage.getItem('loggedInUser'));
if (!user) window.location.href = 'index.html';

document.getElementById('welcomeUser').textContent = user.username;

function logout() {
  localStorage.removeItem('loggedInUser');
  window.location.href = 'index.html';
}

function showAddForm() {
  document.getElementById('addForm').style.display = 'block';
}

function hideAddForm() {
  document.getElementById('addForm').style.display = 'none';
}

async function loadConsumables() {
  try {
    const res = await fetch(`${BASE}/consumables`);
    const consumables = await res.json();

    document.getElementById('totalConsumables').textContent = consumables.length;
    document.getElementById('availableCount').textContent = consumables.filter(c => c.status === 'Available').length;
    document.getElementById('lowStockCount').textContent = consumables.filter(c => c.status === 'Low Stock').length;
    document.getElementById('outOfStockCount').textContent = consumables.filter(c => c.status === 'Out of Stock').length;

    const tbody = document.getElementById('consumablesTable');
    if (consumables.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" style="text-align:center; color:#94a3b8;">No consumables added yet</td></tr>';
      return;
    }

    tbody.innerHTML = consumables.map(c => `
      <tr>
        <td>${c.name}</td>
        <td>${c.category}</td>
        <td>${c.quantity}</td>
        <td>${c.unit}</td>
        <td>${c.supplier}</td>
        <td>${new Date(c.expiryDate).toLocaleDateString()}</td>
        <td>
          <span class="badge-${c.status === 'Available' ? 'pass' : c.status === 'Low Stock' ? 'warning' : 'fail'}">
            ${c.status}
          </span>
        </td>
        <td>
          <button class="btn-danger" onclick="deleteConsumable('${c._id}')">Delete</button>
        </td>
      </tr>
    `).join('');

  } catch (err) {
    console.error('Error loading consumables:', err);
  }
}

async function addConsumable() {
  const name = document.getElementById('conName').value;
  const category = document.getElementById('conCategory').value;
  const quantity = document.getElementById('conQuantity').value;
  const unit = document.getElementById('conUnit').value;
  const supplier = document.getElementById('conSupplier').value;
  const expiryDate = document.getElementById('conExpiry').value;
  const status = document.getElementById('conStatus').value;

  if (!name || !quantity || !supplier || !expiryDate) {
    alert('Please fill all fields!');
    return;
  }

  try {
    const res = await fetch(`${BASE}/consumables`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, category, quantity, unit, supplier, expiryDate, status })
    });

    if (res.ok) {
      alert('Consumable added successfully!');
      hideAddForm();
      loadConsumables();
    } else {
      const data = await res.json();
      alert(data.error || 'Something went wrong');
    }
  } catch (err) {
    console.error('Error adding consumable:', err);
    alert('Could not connect to server!');
  }
}

async function deleteConsumable(id) {
  if (!confirm('Are you sure you want to delete this consumable?')) return;
  try {
    const res = await fetch(`${BASE}/consumables/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert('Consumable deleted!');
      loadConsumables();
    }
  } catch (err) {
    console.error('Error deleting consumable:', err);
  }
}

AOS.init({ duration: 600, once: true });

loadConsumables();
function searchConsumables() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const rows = document.querySelectorAll('#consumablesTable tr');
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    row.style.display = text.includes(query) ? '' : 'none';
  });
}
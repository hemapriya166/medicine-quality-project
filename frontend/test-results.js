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

// Current test type
let currentType = 'Medicine';

// Show/hide form
function showAddForm() {
  document.getElementById('addForm').style.display = 'block';
}

function hideAddForm() {
  document.getElementById('addForm').style.display = 'none';
}

// Switch between Medicine and Consumable
function switchType(type) {
  currentType = type;

  if (type === 'Medicine') {
    document.getElementById('medicineFields').style.display = 'block';
    document.getElementById('consumableFields').style.display = 'none';
    document.getElementById('btnMedicine').style.background = '#16a34a';
    document.getElementById('btnMedicine').style.color = 'white';
    document.getElementById('btnConsumable').style.background = 'white';
    document.getElementById('btnConsumable').style.color = '#16a34a';
  } else {
    document.getElementById('medicineFields').style.display = 'none';
    document.getElementById('consumableFields').style.display = 'block';
    document.getElementById('btnMedicine').style.background = 'white';
    document.getElementById('btnMedicine').style.color = '#16a34a';
    document.getElementById('btnConsumable').style.background = '#16a34a';
    document.getElementById('btnConsumable').style.color = 'white';
  }
}

// Submit test
async function submitTest() {
  try {
    const formData = new FormData();
    formData.append('testType', currentType);

    if (currentType === 'Medicine') {
      const medicineName = document.getElementById('medicineName').value;
      const batchNumber = document.getElementById('batchNumber').value;
      const purity = document.getElementById('purity').value;
      const pH = document.getElementById('pH').value;

      if (!medicineName || !batchNumber || !purity || !pH) {
        alert('Please fill all fields!');
        return;
      }

      formData.append('medicineName', medicineName);
      formData.append('batchNumber', batchNumber);
      formData.append('purity', purity);
      formData.append('pH', pH);
      formData.append('moistureContent', document.getElementById('moistureContent').value);
      formData.append('dissolutionRate', document.getElementById('dissolutionRate').value);
      formData.append('appearance', document.getElementById('appearance').value);


    } else {
      const consumableName = document.getElementById('consumableName').value;
      const category = document.getElementById('conCategory').value;
      const condition = document.getElementById('condition').value;
      const expiryDate = document.getElementById('conExpiry').value;
      const sterilityCheck = document.getElementById('sterilityCheck').value;
      const physicalIntegrity = document.getElementById('physicalIntegrity').value;

      if (!consumableName || !expiryDate) {
        alert('Please fill all fields!');
        return;
      }

      formData.append('consumableName', consumableName);
      formData.append('category', category);
      formData.append('condition', condition);
      formData.append('expiryDate', expiryDate);
      formData.append('sterilityCheck', sterilityCheck);
      formData.append('physicalIntegrity', physicalIntegrity);
    }

    // Add photo if selected
    const photoInput = document.getElementById('photoInput');
    if (photoInput.files[0]) {
      if (photoInput.files[0].size > 5 * 1024 * 1024) {
        alert('Photo must be less than 5MB!');
        return;
      }
      formData.append('photo', photoInput.files[0]);
    }

    const res = await fetch(`${BASE}/test-results`, {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const result = await res.json();
      if (result.status === 'Pass') {
        alert('✅ Test submitted! Result: PASS');
      } else {
        alert('❌ Test submitted! Result: FAIL — Alert generated automatically!');
      }
      hideAddForm();
      loadTestResults();
    } else {
      const data = await res.json();
      alert(data.error || 'Something went wrong');
    }

  } catch (err) {
    console.error('Error submitting test:', err);
    alert('Could not connect to server!');
  }
}
// Convert photo to base64
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// Load test results
async function loadTestResults() {
  try {
    const res = await fetch(`${BASE}/test-results`);
    const tests = await res.json();

    const tbody = document.getElementById('testResultsTable');

    if (tests.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; color:#94a3b8;">No test results yet</td></tr>';
      return;
    }

    tbody.innerHTML = tests.map(t => {
      const isMedicine = t.testType === 'Medicine';
      const name = isMedicine ? t.medicineName : t.consumableName;
      const batchOrCategory = isMedicine ? t.batchNumber : t.category;
      const details = isMedicine
        ? `Purity: ${t.purity}% | pH: ${t.pH}`
        : `Condition: ${t.condition}`;

      const photoCell = t.photo
        ? `<img src="${t.photo}" style="width:40px; height:40px; object-fit:cover; border-radius:6px; cursor:pointer;"
            onclick="window.open('${t.photo}')"/>`
        : '<span style="color:#94a3b8; font-size:12px;">No photo</span>';

      return `
        <tr>
          <td>${isMedicine ? '💊 Medicine' : '🧪 Consumable'}</td>
          <td>${name || '-'}</td>
          <td>${batchOrCategory || '-'}</td>
          <td>${details}</td>
          <td>${new Date(t.testDate).toLocaleDateString()}</td>
          <td><span class="badge-${t.status === 'Pass' ? 'pass' : 'fail'}">${t.status}</span></td>
          <td>${photoCell}</td>
        </tr>
      `;
    }).join('');

  } catch (err) {
    console.error('Error loading test results:', err);
  }
}

// Init AOS
AOS.init({ duration: 600, once: true });

loadTestResults();
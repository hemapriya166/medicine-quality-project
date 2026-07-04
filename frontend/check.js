const BASE = 'http://localhost:5000/api';

async function searchMedicine() {
  const query = document.getElementById('searchInput').value.trim();

  if (!query) {
    alert('Please enter a medicine name or batch number!');
    return;
  }

  // Show loading
  document.getElementById('resultsArea').innerHTML = `
    <div class="loading-state">
      <p>🔍 Searching for "${query}"...</p>
    </div>
  `;

  try {
    // Fetch all test results
    const res = await fetch(`${BASE}/test-results`);
    const tests = await res.json();

    // Filter only medicine tests matching the query
    const filtered = tests.filter(t => {
      if (t.testType !== 'Medicine') return false;
      const nameMatch = t.medicineName &&
        t.medicineName.toLowerCase().includes(query.toLowerCase());
      const batchMatch = t.batchNumber &&
        t.batchNumber.toLowerCase().includes(query.toLowerCase());
      return nameMatch || batchMatch;
    });

    // Show results
    if (filtered.length === 0) {
      document.getElementById('resultsArea').innerHTML = `
        <div class="empty-state" data-aos="fade-up">
          <p class="icon">😕</p>
          <p class="title">No results found</p>
          <p class="desc">No quality test records found for "${query}". The medicine may not have been tested yet or the name/batch number may be incorrect.</p>
        </div>
      `;
      return;
    }

    // Show result count
    const countText = `
      <p style="font-size:13px; color:#64748b; margin:0 0 16px;">
        Found <strong style="color:#0c447c;">${filtered.length}</strong>
        test result${filtered.length > 1 ? 's' : ''} for
        "<strong style="color:#0c447c;">${query}</strong>"
      </p>
    `;

    // Render result cards
    const cards = filtered.map(t => {
      const isPass = t.status === 'Pass';
      const testDate = new Date(t.testDate).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });

      return `
        <div class="result-card ${isPass ? 'pass' : 'fail'}" data-aos="fade-up">
          <div class="result-header">
            <div>
              <p class="result-name">${t.medicineName}</p>
              <p class="result-batch">Batch: ${t.batchNumber}</p>
            </div>
            <span class="${isPass ? 'badge-pass' : 'badge-fail'}" style="font-size:13px; padding:6px 14px;">
              ${isPass ? '✅ Pass' : '❌ Fail'}
            </span>
          </div>

          <div class="result-stats ${isPass ? 'pass-bg' : 'fail-bg'}">
            <div class="stat-item">
              <p class="label">Purity</p>
              <p class="value" style="color:${isPass ? '#166534' : '#991b1b'};">
                ${t.purity}%
              </p>
            </div>
            <div class="stat-item">
              <p class="label">pH level</p>
              <p class="value" style="color:${isPass ? '#166534' : '#991b1b'};">
                ${t.pH}
              </p>
            </div>
            <div class="stat-item">
              <p class="label">Test date</p>
              <p class="value" style="font-size:13px; color:${isPass ? '#166534' : '#991b1b'};">
                ${testDate}
              </p>
            </div>
          </div>

          ${!isPass ? `
            <div style="margin-top:12px; background:#fee2e2; border-radius:8px;
              padding:10px 14px; border:1px solid #fecaca;">
              <p style="font-size:12px; color:#991b1b; margin:0;">
                ⚠️ This medicine failed the quality test.
                Please do not use this batch.
                Contact your pharmacist or healthcare provider.
              </p>
            </div>
          ` : `
            <div style="margin-top:12px; background:#dcfce7; border-radius:8px;
              padding:10px 14px; border:1px solid #bbf7d0;">
              <p style="font-size:12px; color:#166534; margin:0;">
                ✅ This medicine passed the quality test and meets all safety standards.
              </p>
            </div>
          `}
        </div>
      `;
    }).join('');

    document.getElementById('resultsArea').innerHTML = countText + cards;

    // Reinit AOS for new elements
    AOS.init({ duration: 600, once: true });

  } catch (err) {
    document.getElementById('resultsArea').innerHTML = `
      <div class="empty-state">
        <p class="icon">⚠️</p>
        <p class="title">Connection error</p>
        <p class="desc">Could not connect to server. Please make sure the backend is running.</p>
      </div>
    `;
    console.error('Search error:', err);
  }
}
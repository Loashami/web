
    // Mock data
    const mockStats = {
      revenue: '$24,560',
      apps: 182,
      clients: 28,
      cancels: 12,
    };

    const mockRecent = [
      {title: 'Monthly Financial Report', date: 'April 2025'},
      {title: 'Quarterly Business Review', date: 'Q1 2025'},
      {title: 'Staff Performance Analysis', date: 'March 2025'},
      {title: 'Client Satisfaction Survey', date: 'February 2025'},
    ];

    // DOM Elements
    const revenueValue = document.getElementById('revenueValue');
    const appsValue = document.getElementById('appsValue');
    const clientsValue = document.getElementById('clientsValue');
    const cancelsValue = document.getElementById('cancelsValue');
    const recentReports = document.getElementById('recentReports');
    const tabBtns = document.querySelectorAll('.tabBtn');
    const tabContents = document.querySelectorAll('.tabContent');

    // Initial load
    revenueValue.textContent = mockStats.revenue;
    appsValue.textContent = mockStats.apps;
    clientsValue.textContent = mockStats.clients;
    cancelsValue.textContent = mockStats.cancels;
    mockRecent.forEach(r => {
      recentReports.innerHTML += `
        <div class="flex items-center justify-between border rounded p-3">
          <div><strong>${r.title}</strong><br><small>${r.date}</small></div>
          <button class="border rounded px-3 py-1">Download</button>
        </div>`;
    });

    // Tab switching
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabContents.forEach(tc => tc.classList.add('hidden'));
        tabBtns.forEach(b => b.classList.remove('bg-gray-200'));
        document.getElementById(btn.dataset.tab).classList.remove('hidden');
        btn.classList.add('bg-gray-200');
      });
    });
    tabBtns[0].click();

    // Print & export stubs
    document.getElementById('printBtn').addEventListener('click', () => window.print());
    document.getElementById('exportBtn').addEventListener('click', () => alert('Exporting...'));

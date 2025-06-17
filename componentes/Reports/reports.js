    // Datos simulados
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

    // Render estadísticos
    document.getElementById('revenueValue').textContent = mockStats.revenue;
    document.getElementById('appsValue').textContent = mockStats.apps;
    document.getElementById('clientsValue').textContent = mockStats.clients;
    document.getElementById('cancelsValue').textContent = mockStats.cancels;

    const recentReports = document.getElementById('recentReports');
    mockRecent.forEach(r => {
      recentReports.innerHTML += `
        <div class="flex items-center justify-between border rounded p-3">
          <div><strong>${r.title}</strong><br><small>${r.date}</small></div>
          <button class="border rounded px-3 py-1">Download</button>
        </div>`;
    });

    // Tabs
    const tabBtns = document.querySelectorAll('.tabBtn');
    const tabContents = document.querySelectorAll('.tabContent');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('bg-gray-200'));
        tabContents.forEach(c => c.classList.add('hidden'));
        btn.classList.add('bg-gray-200');
        document.getElementById(btn.dataset.tab).classList.remove('hidden');
      });
    });
    tabBtns[0].click();

    // Chart.js
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
          label: 'Revenue',
          data: [4000, 6000, 5500, 9000],
          backgroundColor: 'rgba(59, 130, 246, 0.5)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: { y: { beginAtZero: true } }
      }
    });

    // Print/export
    document.getElementById('printBtn').addEventListener('click', () => window.print());
    document.getElementById('exportBtn').addEventListener('click', () => alert('Exportando datos...'));
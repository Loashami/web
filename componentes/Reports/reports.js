function initComponent() {
      const tabButtons = document.querySelectorAll('.tab-btn');
      const tabSections = document.querySelectorAll('.tab-section');

      tabButtons.forEach(button => {
        button.addEventListener('click', () => {
          tabButtons.forEach(btn => btn.classList.remove('text-blue-600', 'font-medium'));
          button.classList.add('text-blue-600', 'font-medium');

          const tab = button.getAttribute('data-tab');
          tabSections.forEach(section => {
            section.classList.toggle('hidden', section.id !== 'tab-' + tab);
          });
        });
      });

      new Chart(document.getElementById('revenueChart'), {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'Revenue ($)',
            data: [12000, 15000, 18000, 22000, 20000, 24560],
            borderColor: 'rgb(59, 130, 246)',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          }]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      });

      new Chart(document.getElementById('appointmentsChart'), {
        type: 'bar',
        data: {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              label: 'Scheduled',
              data: [12, 15, 10, 8],
              backgroundColor: 'rgba(96, 165, 250, 0.8)'
            },
            {
              label: 'Completed',
              data: [10, 14, 8, 6],
              backgroundColor: 'rgba(34, 197, 94, 0.8)'
            },
            {
              label: 'Cancelled',
              data: [2, 1, 2, 2],
              backgroundColor: 'rgba(239, 68, 68, 0.8)'
            }
          ]
        },
        options: { responsive: true, scales: { y: { beginAtZero: true } } }
      });

      new Chart(document.getElementById('servicesChart'), {
        type: 'doughnut',
        data: {
          labels: ['Vaccinations', 'Check-ups', 'Dental Cleaning', 'Surgery', 'Emergency Care', 'Grooming'],
          datasets: [{
            data: [35, 25, 15, 10, 8, 7],
            backgroundColor: [
              '#60A5FA', '#5EEAD4', '#C084FC', '#FB7185', '#FBBF24', '#FDE68A'
            ]
          }]
        },
        options: { responsive: true }
      });

      new Chart(document.getElementById('staffChart'), {
        type: 'radar',
        data: {
          labels: ['Efficiency', 'Satisfaction', 'Punctuality', 'Teamwork', 'Skill'],
          datasets: [{
            label: 'Staff A',
            data: [90, 85, 80, 75, 95],
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            borderColor: 'rgb(59, 130, 246)'
          }]
        },
        options: { responsive: true, scales: { r: { beginAtZero: true } } }
      });

      document.querySelectorAll('button').forEach(btn => {
        if (btn.textContent === 'Print') btn.onclick = () => window.print();
        if (btn.textContent === 'Export') btn.onclick = () => alert('Export feature coming soon!');
      });
    };
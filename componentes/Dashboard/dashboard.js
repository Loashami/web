
    // Cargar los íconos de Lucide
    lucide.createIcons();

    // Datos simulados (pueden venir de una API)
    const dashboardData = {
      appointmentsToday: 24,
      revenueThisWeek: 2450,
      cancellations: 5,
      revenueMonthly: {
        labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun"],
        data: [3000, 4000, 3500, 4200, 5000, 4700],
      },
      alerts: [
        {
          icon: "alert-triangle",
          title: "Low Inventory",
          description: "Vaccine supplies are running low",
          color: "yellow",
        },
        {
          icon: "alert-triangle",
          title: "Complaint Filed",
          description: "New complaint from client #1234",
          color: "red",
        },
        {
          icon: "alert-triangle",
          title: "Staff Shortage",
          description: "Understaffed on May 25th",
          color: "yellow",
        },
      ]
    };

    // Mostrar datos en tarjetas
    document.getElementById("appointments-today").textContent = dashboardData.appointmentsToday;
    document.getElementById("revenue-week").textContent = `$${dashboardData.revenueThisWeek}`;
    document.getElementById("cancellations").textContent = dashboardData.cancellations;

    // Inicializar Chart.js
    const ctx = document.getElementById('revenueChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: dashboardData.revenueMonthly.labels,
        datasets: [{
          label: 'Revenue',
          data: dashboardData.revenueMonthly.data,
          backgroundColor: 'rgba(34, 197, 94, 0.2)', // Tailwind green-500
          borderColor: 'rgba(34, 197, 94, 1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });

    // Mostrar alertas dinámicamente
    const alertContainer = document.getElementById("alert-container");
    dashboardData.alerts.forEach(alert => {
      const alertCard = document.createElement("div");
      alertCard.className = `flex items-start space-x-3 bg-${alert.color}-100 p-3 rounded-lg`;
      alertCard.innerHTML = `
        <i data-lucide="${alert.icon}" class="text-${alert.color}-600 w-6 h-6"></i>
        <div>
          <p class="font-semibold">${alert.title}</p>
          <p class="text-sm text-gray-600">${alert.description}</p>
        </div>
      `;
      alertContainer.appendChild(alertCard);
    });

    lucide.createIcons(); // Re-render icons después de agregar dinámicamente
  
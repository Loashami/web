function initComponent() {
  const users = [
    { id: 1, name: "Dr. Sarah Johnson", email: "sarah.johnson@vetclinic.com", role: "veterinarian", specialty: "General Practice", status: "active", lastActive: "2025-05-19T14:30:00" },
    { id: 2, name: "Dr. Michael Chen", email: "michael.chen@vetclinic.com", role: "veterinarian", specialty: "Surgery", status: "active", lastActive: "2025-05-19T10:15:00" },
    { id: 3, name: "John Doe", email: "john.doe@example.com", role: "client", pets: ["Max (Dog)", "Bella (Cat)"], status: "active", lastActive: "2025-05-18T16:45:00" },
    { id: 4, name: "Sarah Smith", email: "sarah.smith@example.com", role: "client", pets: ["Rocky (Dog)"], status: "active", lastActive: "2025-05-17T09:20:00" },
    { id: 5, name: "Alex Rodriguez", email: "alex.rodriguez@vetclinic.com", role: "intern", supervisor: "Dr. Sarah Johnson", status: "active", lastActive: "2025-05-19T11:30:00" },
    { id: 6, name: "Jessica Taylor", email: "jessica.taylor@vetclinic.com", role: "intern", supervisor: "Dr. Michael Chen", status: "active", lastActive: "2025-05-19T13:10:00" },
    { id: 7, name: "Robert Wilson", email: "robert.wilson@vetclinic.com", role: "administrator", status: "active", lastActive: "2025-05-19T15:45:00" },
    { id: 8, name: "Emily Davis", email: "emily.davis@example.com", role: "client", pets: ["Luna (Cat)"], status: "inactive", lastActive: "2025-04-30T14:20:00" }
  ];

  let activeTab = "all";

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now - date) / (1000 * 60 * 60);
    return diff < 24 ? `${Math.floor(diff)} hours ago` : date.toLocaleDateString();
  };

  function renderUsers() {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    const filtered = users.filter(user => {
      const matchSearch = user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search);
      const matchTab = activeTab === "all" || user.role === activeTab;
      return matchSearch && matchTab;
    });

    for (const user of filtered) {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-3">${user.name}</td>
        <td class="p-3">${user.email}</td>
        <td class="p-3 capitalize">${user.role}</td>
        <td class="p-3">${user.specialty || user.supervisor || (user.pets?.join(', ') || '—')}</td>
        <td class="p-3">
          <span class="px-2 py-1 rounded text-white ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}">
            ${user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
        </td>
        <td class="p-3">${formatDate(user.lastActive)}</td>
        <td class="p-3 space-x-2">
          <button class="px-2 py-1 border rounded text-sm">Edit</button>
          <button class="px-2 py-1 border border-red-500 text-red-500 rounded text-sm">Deactivate</button>
        </td>
      `;
      tbody.appendChild(row);
    }
  }

  function setTab(tab, event) {
    activeTab = tab;
    renderUsers();

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.remove('bg-blue-100', 'text-blue-600');
    });

    event.target.classList.add('bg-blue-100', 'text-blue-600');
  }

  document.getElementById('searchInput').addEventListener('input', renderUsers);

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const selectedTab = btn.dataset.tab;
      setTab(selectedTab, e);
    });
  });

  renderUsers();
}

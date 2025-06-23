function initComponent() {
  const users = [
    { id: 1, name: "Dr. Sarah Johnson", email: "sarah.johnson@vetclinic.com", role: "veterinario", specialty: "General Practice", status: "active", lastActive: "2025-05-19T14:30:00" },
    { id: 2, name: "Dr. Michael Chen", email: "michael.chen@vetclinic.com", role: "veterinario", specialty: "Surgery", status: "active", lastActive: "2025-05-19T10:15:00" },
    { id: 3, name: "John Doe", email: "john.doe@example.com", role: "cliente", pets: ["Max (Dog)", "Bella (Cat)"], status: "active", lastActive: "2025-05-18T16:45:00" },
    { id: 4, name: "Sarah Smith", email: "sarah.smith@example.com", role: "cliente", pets: ["Rocky (Dog)"], status: "active", lastActive: "2025-05-17T09:20:00" },
    { id: 5, name: "Alex Rodriguez", email: "alex.rodriguez@vetclinic.com", role: "interno", supervisor: "Dr. Sarah Johnson", status: "active", lastActive: "2025-05-19T11:30:00" },
    { id: 6, name: "Jessica Taylor", email: "jessica.taylor@vetclinic.com", role: "interno", supervisor: "Dr. Michael Chen", status: "active", lastActive: "2025-05-19T13:10:00" },
    { id: 7, name: "Robert Wilson", email: "robert.wilson@vetclinic.com", role: "administrador", status: "active", lastActive: "2025-05-19T15:45:00" },
    { id: 8, name: "Emily Davis", email: "emily.davis@example.com", role: "cliente", pets: ["Luna (Cat)"], status: "inactive", lastActive: "2025-04-30T14:20:00" }
  ];
  let activeTab = "all";

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffHours = Math.floor((now - date) / 36e5);
    return diffHours < 24 ? `${diffHours} hours ago` : date.toLocaleDateString();
  };

  const renderUsers = () => {
    const search = document.getElementById('searchInput').value.toLowerCase();
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    const filtered = users.filter(user =>
      (user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search)) &&
      (activeTab === 'all' || user.role === activeTab)
    );

    if (filtered.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="p-3 text-center text-gray-500">No users found.</td></tr>`;
      return;
    }

    filtered.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="p-3">${user.name}</td>
        <td class="p-3">${user.email}</td>
        <td class="p-3 capitalize">${user.role}</td>
        <td class="p-3">${user.specialty || user.supervisor || (user.pets?.join(', ') || '—')}</td>
        <td class="p-3">
          <span class="px-2 py-1 rounded text-white ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-500'}">
            ${user.status}
          </span>
        </td>
        <td class="p-3">${formatDate(user.lastActive)}</td>
        <td class="p-3 space-x-2">
          <button class="edit-btn px-2 py-1 border rounded text-sm" data-id="${user.id}">Edit</button>
          <button class="deactivate-btn px-2 py-1 border border-red-500 text-red-500 rounded text-sm" data-id="${user.id}">
            ${user.status === 'active' ? 'Deactivate' : 'Activate'}
          </button>
        </td>
      `;
      tbody.appendChild(row);
    });

    document.querySelectorAll('.edit-btn').forEach(btn =>
      btn.addEventListener('click', () => openEditModal(+btn.dataset.id))
    );
    document.querySelectorAll('.deactivate-btn').forEach(btn =>
      btn.addEventListener('click', () => toggleStatus(+btn.dataset.id))
    );
  };

  const setTab = (tab) => {
    activeTab = tab;
    renderUsers();
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('bg-blue-100', btn.dataset.tab === tab);
      btn.classList.toggle('text-blue-600', btn.dataset.tab === tab);
    });
  };

  // Modal
  const modal = document.getElementById('userModal');
  const form = document.getElementById('userForm');
  const modalTitle = document.getElementById('modalTitle');

  const showModal = () => modal.classList.remove('hidden');
  const hideModal = () => {
    form.reset();
    document.getElementById('editUserId').value = '';
    modal.classList.add('hidden');
  };

  const openEditModal = (id) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    modalTitle.textContent = "Edit User";
    document.getElementById('editUserId').value = user.id;
    document.getElementById('userName').value = user.name;
    document.getElementById('userEmail').value = user.email;
    document.getElementById('userRole').value = user.role;
    showModal();
  };

  const toggleStatus = (id) => {
    const user = users.find(u => u.id === id);
    if (user) {
      user.status = user.status === 'active' ? 'inactive' : 'active';
      renderUsers();
    }
  };

  // Eventos
  document.getElementById('addUserBtn').addEventListener('click', () => {
    modalTitle.textContent = "Add New User";
    form.reset();
    document.getElementById('editUserId').value = '';
    showModal();
  });

  document.getElementById('cancelModal').addEventListener('click', hideModal);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('editUserId').value;
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const role = document.getElementById('userRole').value;

    if (!name || !email || !role) return;

    if (id) {
      const user = users.find(u => u.id == id);
      if (user) {
        user.name = name;
        user.email = email;
        user.role = role;
      }
    } else {
      users.push({
        id: users.length + 1,
        name,
        email,
        role,
        status: 'active',
        lastActive: new Date().toISOString()
      });
    }

    hideModal();
    renderUsers();
  });

  document.getElementById('searchInput').addEventListener('input', renderUsers);
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => setTab(btn.dataset.tab));
  });

  renderUsers();
}

initComponent();

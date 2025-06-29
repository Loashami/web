function initComponent() {
  const appointments = [
    { id: "1", date: "2025-05-20", time: "10:00 AM", client: "John Doe", pet: "Max (Perro)", petType: "Golden Retriever, 5 años", service: "Vacunación", doctor: "Dra. Sarah Johnson", status: "confirmada" },
    { id: "2", date: "2025-05-20", time: "11:30 AM", client: "Sarah Smith", pet: "Bella (Gato)", petType: "Siamés, 3 años", service: "Revisión", doctor: "Dr. Michael Chen", status: "confirmada" },
    { id: "3", date: "2025-05-20", time: "2:00 PM", client: "Michael Johnson", pet: "Rocky (Perro)", petType: "Bulldog, 2 años", service: "Limpieza dental", doctor: "Dra. Emily Rodríguez", status: "confirmada" },
    { id: "4", date: "2025-05-21", time: "9:30 AM", client: "Emily Davis", pet: "Luna (Gato)", petType: "Maine Coon, 4 años", service: "Vacunación", doctor: "Dra. Sarah Johnson", status: "confirmada" },
    { id: "5", date: "2025-05-21", time: "1:00 PM", client: "David Wilson", pet: "Charlie (Ave)", petType: "Cacatúa, 1 año", service: "Recorte de alas", doctor: "Dr. David Kim", status: "confirmada" },
    { id: "6", date: "2025-05-22", time: "10:00 AM", client: "Jennifer Brown", pet: "Cooper (Perro)", petType: "Beagle, 6 años", service: "Revisión", doctor: "Dra. Sarah Johnson", status: "confirmada" },
    { id: "7", date: "2025-05-19", time: "3:30 PM", client: "Robert Garcia", pet: "Daisy (Perro)", petType: "Poodle, 4 años", service: "Estética", doctor: "Dr. Michael Chen", status: "completada" },
    { id: "8", date: "2025-05-19", time: "2:00 PM", client: "Amanda Lee", pet: "Oliver (Gato)", petType: "Atigrado, 2 años", service: "Vacunación", doctor: "Dra. Emily Rodríguez", status: "completada" },
    { id: "9", date: "2025-05-18", time: "11:00 AM", client: "Thomas Martinez", pet: "Milo (Perro)", petType: "Labrador, 3 años", service: "Revisión", doctor: "Dr. David Kim", status: "cancelada" }
  ];

  function getStatusClass(status) {
    return {
      confirmada: "bg-blue-500",
      completada: "bg-green-500",
      cancelada: "bg-red-500"
    }[status] || "bg-gray-400";
  }

  function getFilters() {
    return {
      date: document.getElementById("filter-date").value,
      status: document.getElementById("filter-status").value,
      doctor: document.getElementById("filter-doctor").value,
      query: document.getElementById("search-query").value.toLowerCase()
    };
  }

  function renderAppointments() {
    const tbody = document.getElementById("appointment-body");
    const { date, status, doctor, query } = getFilters();

    const filtered = appointments.filter(a =>
      (!date || a.date === date) &&
      (status === "all" || a.status === status) &&
      (doctor === "all" || a.doctor === doctor) &&
      (!query || a.client.toLowerCase().includes(query) || a.pet.toLowerCase().includes(query) || a.service.toLowerCase().includes(query))
    );

    tbody.innerHTML = filtered.length === 0
      ? `<tr><td colspan="7" class="text-center p-4">No hay citas registradas.</td></tr>`
      : filtered.map(a => `
        <tr>
          <td class="p-4 font-medium">${a.time}</td>
          <td class="p-4">${a.client}</td>
          <td class="p-4">
            <div>${a.pet}</div>
            <div class="text-xs text-gray-500">${a.petType}</div>
          </td>
          <td class="p-4">${a.service}</td>
          <td class="p-4">${a.doctor}</td>
          <td class="p-4">
            <span class="px-2 py-1 rounded text-white text-xs ${getStatusClass(a.status)}">${a.status}</span>
          </td>
          <td class="p-4 flex gap-2">
            <button class="px-2 py-1 text-sm bg-blue-500 text-white rounded" onclick='openEditModal(${JSON.stringify(a)})'>Editar</button>
            <button class="px-2 py-1 text-sm bg-red-500 text-white rounded" onclick='cancelAppointment("${a.id}")'>Eliminar</button>
          </td>
        </tr>
      `).join("");
  }

  function openEditModal(a) {
    document.getElementById("edit-id").value = a.id;
    document.getElementById("edit-client").value = a.client;
    document.getElementById("edit-pet").value = a.pet;
    document.getElementById("edit-service").value = a.service;
    document.getElementById("edit-modal").classList.remove("hidden");
  }

  function cancelAppointment(id) {
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1 && confirm("¿Seguro que deseas cancelar esta cita?")) {
      appointments.splice(index, 1);
      renderAppointments();
    }
  }

  // Exponer funciones para botones
  window.openEditModal = openEditModal;
  window.cancelAppointment = cancelAppointment;

  // Poblar doctores
  const doctorSelect = document.getElementById("filter-doctor");
  [...new Set(appointments.map(a => a.doctor))].forEach(doc => {
    const opt = document.createElement("option");
    opt.value = doc;
    opt.textContent = doc;
    doctorSelect.appendChild(opt);
  });

  // Eventos
  document.getElementById("edit-form").addEventListener("submit", e => {
    e.preventDefault();
    const id = document.getElementById("edit-id").value;
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments[index].client = document.getElementById("edit-client").value;
      appointments[index].pet = document.getElementById("edit-pet").value;
      appointments[index].service = document.getElementById("edit-service").value;
      document.getElementById("edit-modal").classList.add("hidden");
      renderAppointments();
    }
  });

  document.getElementById("cancel-edit").addEventListener("click", () => {
    document.getElementById("edit-modal").classList.add("hidden");
  });

  ["filter-date", "filter-status", "filter-doctor", "search-query"].forEach(id => {
    document.getElementById(id).addEventListener("input", renderAppointments);
  });

  renderAppointments();
}

document.addEventListener("DOMContentLoaded", initComponent);

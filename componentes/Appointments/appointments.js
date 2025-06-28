// appointments.data.js
const appointments = [
  { id: "1", date: "2025-05-20", time: "10:00 AM", client: "John Doe", pet: "Max (Dog)", petType: "Golden Retriever, 5 years", service: "Vaccination", doctor: "Dr. Sarah Johnson", status: "confirmed" },
  { id: "2", date: "2025-05-20", time: "11:30 AM", client: "Sarah Smith", pet: "Bella (Cat)", petType: "Siamese, 3 years", service: "Check-up", doctor: "Dr. Michael Chen", status: "confirmed" },
  { id: "3", date: "2025-05-20", time: "2:00 PM", client: "Michael Johnson", pet: "Rocky (Dog)", petType: "Bulldog, 2 years", service: "Dental Cleaning", doctor: "Dr. Emily Rodriguez", status: "confirmed" },
  { id: "4", date: "2025-05-21", time: "9:30 AM", client: "Emily Davis", pet: "Luna (Cat)", petType: "Maine Coon, 4 years", service: "Vaccination", doctor: "Dr. Sarah Johnson", status: "confirmed" },
  { id: "5", date: "2025-05-21", time: "1:00 PM", client: "David Wilson", pet: "Charlie (Bird)", petType: "Cockatiel, 1 year", service: "Wing Trimming", doctor: "Dr. David Kim", status: "confirmed" },
  { id: "6", date: "2025-05-22", time: "10:00 AM", client: "Jennifer Brown", pet: "Cooper (Dog)", petType: "Beagle, 6 years", service: "Check-up", doctor: "Dr. Sarah Johnson", status: "confirmed" },
  { id: "7", date: "2025-05-19", time: "3:30 PM", client: "Robert Garcia", pet: "Daisy (Dog)", petType: "Poodle, 4 years", service: "Grooming", doctor: "Dr. Michael Chen", status: "completed" },
  { id: "8", date: "2025-05-19", time: "2:00 PM", client: "Amanda Lee", pet: "Oliver (Cat)", petType: "Tabby, 2 years", service: "Vaccination", doctor: "Dr. Emily Rodriguez", status: "completed" },
  { id: "9", date: "2025-05-18", time: "11:00 AM", client: "Thomas Martinez", pet: "Milo (Dog)", petType: "Labrador, 3 years", service: "Check-up", doctor: "Dr. David Kim", status: "cancelled" }
];

// appointments.helpers.js
function getStatusClass(status) {
  switch (status) {
    case "confirmed": return "bg-blue-500";
    case "completed": return "bg-green-500";
    case "cancelled": return "bg-red-500";
    default: return "bg-gray-400";
  }
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

// appointments.ui.js
function renderAppointments(filters) {
  const tbody = document.getElementById("appointment-body");
  const filtered = appointments.filter(a => {
    const matchDate = filters.date ? a.date === filters.date : true;
    const matchStatus = filters.status === "all" || a.status === filters.status;
    const matchDoctor = filters.doctor === "all" || a.doctor === filters.doctor;
    const matchSearch = !filters.query || a.client.toLowerCase().includes(filters.query) || a.pet.toLowerCase().includes(filters.query) || a.service.toLowerCase().includes(filters.query);
    return matchDate && matchStatus && matchDoctor && matchSearch;
  });

  tbody.innerHTML = "";
  if (filtered.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7" class="text-center p-4">No hay citas registradas.</td></tr>`;
    return;
  }

  for (const a of filtered) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td class="p-4 font-medium">${a.time}</td>
      <td class="p-4">${a.client}</td>
      <td class="p-4">
        <div>${a.pet}</div>
        <div class="text-xs text-gray-500">${a.petType}</div>
      </td>
      <td class="p-4">${a.service}</td>
      <td class="p-4">${a.doctor}</td>
      <td class="p-4">
        <span class="px-2 py-1 rounded text-white text-xs ${getStatusClass(a.status)}">${capitalize(a.status)}</span>
      </td>
      <td class="p-4 flex gap-2">
        <button class="px-2 py-1 text-sm bg-blue-500 text-white rounded" onclick='openEditModal(${JSON.stringify(a)})'>Editar</button>
        <button class="px-2 py-1 text-sm bg-red-500 text-white rounded" onclick='cancelAppointment("${a.id}")'>Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  }
}

// appointments.main.js
function initComponent() {
  const dateInput = document.getElementById("filter-date");
  const statusSelect = document.getElementById("filter-status");
  const doctorSelect = document.getElementById("filter-doctor");
  const searchInput = document.getElementById("search-query");

  const form = document.getElementById("edit-form");
  const modal = document.getElementById("edit-modal");
  const cancelBtn = document.getElementById("cancel-edit");

  const fields = {
    id: document.getElementById("edit-id"),
    client: document.getElementById("edit-client"),
    pet: document.getElementById("edit-pet"),
    service: document.getElementById("edit-service")
  };

  window.openEditModal = function (a) {
    fields.id.value = a.id;
    fields.client.value = a.client;
    fields.pet.value = a.pet;
    fields.service.value = a.service;
    modal.classList.remove("hidden");
  };

  window.cancelAppointment = function (id) {
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1 && confirm("¿Seguro que deseas cancelar esta cita?")) {
      appointments.splice(index, 1);
      renderAppointments(getFilters());
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const id = fields.id.value;
    const index = appointments.findIndex(a => a.id === id);
    if (index !== -1) {
      appointments[index].client = fields.client.value;
      appointments[index].pet = fields.pet.value;
      appointments[index].service = fields.service.value;
      modal.classList.add("hidden");
      renderAppointments(getFilters());
    }
  });

  cancelBtn.addEventListener("click", () => modal.classList.add("hidden"));

  function getFilters() {
    return {
      date: dateInput.value,
      status: statusSelect.value,
      doctor: doctorSelect.value,
      query: searchInput.value.toLowerCase()
    };
  }

  // Unique doctors
  [...new Set(appointments.map(a => a.doctor))].forEach(doctor => {
    const opt = document.createElement("option");
    opt.value = doctor;
    opt.textContent = doctor;
    doctorSelect.appendChild(opt);
  });

  [dateInput, statusSelect, doctorSelect, searchInput].forEach(el => el.addEventListener("input", () => renderAppointments(getFilters())));

  renderAppointments(getFilters());
}

document.addEventListener("DOMContentLoaded", initComponent);

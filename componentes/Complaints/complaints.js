function initComplaints() {
  let complaints = [];
  let selectedComplaint = null;

  function getStatusColor(status) {
    return status === "pendiente"
      ? "bg-yellow-100 text-yellow-800"
      : "bg-green-100 text-green-800";
  }

  function traducirEstado(estado) {
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  }

  function renderComplaints() {
    const body = document.getElementById("complaintsBody");
    const search = document.getElementById("searchInput").value.toLowerCase();
    const status = document.getElementById("statusFilter").value;

    const filtradas = complaints.filter(c => {
      const cliente = c.cliente?.toLowerCase() || "";
      const asunto = c.asunto?.toLowerCase() || "";
      const coincideEstado = status === "todas" || c.estado === status;
      const coincideBusqueda = cliente.includes(search) || asunto.includes(search);
      return coincideEstado && coincideBusqueda;
    });

    body.innerHTML = filtradas.length === 0
      ? `<tr><td colspan="8" class="text-center p-4 text-gray-500">No se encontraron quejas.</td></tr>`
      : filtradas.map(c => `
        <tr class="hover:bg-gray-50">
          <td class="p-3">${new Date(c.fecha).toLocaleDateString()}</td>
          <td class="p-3 font-medium">${c.cliente}</td>
          <td class="p-3">${c.correo}</td>
          <td class="p-3">${c.celular}</td>
          <td class="p-3 truncate max-w-[200px]">${c.asunto}</td>
          <td class="p-3">
            <span class="px-2 py-1 rounded text-xs font-semibold ${getStatusColor(c.estado)}">
              ${traducirEstado(c.estado)}
            </span>
          </td>
          <td class="p-3">${c.veterinario}</td>
          <td class="p-3">
            <button data-id="${c.id}" class="view-btn px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">Ver</button>
          </td>
        </tr>
      `).join("");

    document.querySelectorAll(".view-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        const complaint = complaints.find(c => c.id === id);
        if (complaint) showModal(complaint);
      });
    });

    document.getElementById("resultCount").textContent = `${filtradas.length} queja(s) encontrada(s)`;
  }

  function showModal(complaint) {
    selectedComplaint = complaint;
    document.getElementById("complaintModal").classList.remove("hidden");
    document.body.classList.add("modal-open");

    const content = document.getElementById("modalContent");
    const actions = document.getElementById("modalActions");

    content.innerHTML = `
      <p><strong>Cliente:</strong> ${complaint.cliente}</p>
      <p><strong>Correo:</strong> ${complaint.correo}</p>
      <p><strong>Celular:</strong> ${complaint.celular}</p>
      <p><strong>Estado:</strong> ${traducirEstado(complaint.estado)}</p>
      <p><strong>Veterinario asignado:</strong> ${complaint.veterinario}</p>
      <p><strong>Asunto:</strong> ${complaint.asunto}</p>
      <p><strong>Descripción:</strong> ${complaint.descripcion}</p>
    `;

    if (complaint.estado === "resuelta") {
      actions.classList.add("hidden");
    } else {
      actions.classList.remove("hidden");
    }
  }

  window.closeModal = function () {
    document.getElementById("complaintModal").classList.add("hidden");
    document.body.classList.remove("modal-open");
  };

  window.markAsResolved = function () {
    if (selectedComplaint) {
      selectedComplaint.estado = "resuelta";
      localStorage.setItem("complaints", JSON.stringify(complaints));
      renderComplaints();
      closeModal();
      showToast("La queja ha sido marcada como resuelta.");
    }
  };

  function showToast(mensaje) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast px-4 py-2 bg-green-600 text-white rounded shadow my-2";
    toast.textContent = mensaje;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  function initEvents() {
    document.getElementById("searchInput").addEventListener("input", renderComplaints);
    document.getElementById("statusFilter").addEventListener("change", renderComplaints);
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") closeModal();
    });
    document.addEventListener("click", function (e) {
      const modal = document.getElementById("complaintModal");
      const box = document.getElementById("modalBox");
      if (e.target.closest(".view-btn")) return;
      if (!modal.classList.contains("hidden") && !box.contains(e.target)) {
        closeModal();
      }
    });
  }

  function loadData() {
    const existente = localStorage.getItem("complaints");
    if (existente) {
      complaints = JSON.parse(existente);
    } else {
      complaints = [
        { id: "1", fecha: "2025-06-01", cliente: "Carlos Ruiz", correo: "carlos@gmail.com", celular: "912345678", asunto: "Demora en atención", descripcion: "Tuve que esperar más de 1 hora.", estado: "pendiente", veterinario: "Dr. Medina" },
        { id: "2", fecha: "2025-06-02", cliente: "María López", correo: "maria@gmail.com", celular: "913222456", asunto: "Cobro extra", descripcion: "Se me cobró un servicio que no recibí.", estado: "resuelta", veterinario: "Dra. Torres" },
        { id: "3", fecha: "2025-06-03", cliente: "Pedro Salas", correo: "pedro.s@gmail.com", celular: "934567321", asunto: "No me respondieron", descripcion: "Llamé varias veces y nadie respondió.", estado: "pendiente", veterinario: "Dra. Ramos" },
        { id: "4", fecha: "2025-06-04", cliente: "Lucía Díaz", correo: "lucia.diaz@gmail.com", celular: "900111222", asunto: "Mala atención", descripcion: "El veterinario fue grosero conmigo.", estado: "resuelta", veterinario: "Dr. Romero" },
        { id: "5", fecha: "2025-06-05", cliente: "Andrés Moreno", correo: "andres.m@gmail.com", celular: "987333444", asunto: "Error en diagnóstico", descripcion: "Me dijeron que mi mascota tenía otra cosa.", estado: "pendiente", veterinario: "Dra. Camargo" },
        { id: "6", fecha: "2025-06-06", cliente: "Claudia Vega", correo: "claudia.v@gmail.com", celular: "956987321", asunto: "No entregaron receta", descripcion: "No me dieron el medicamento indicado.", estado: "pendiente", veterinario: "Dr. Salazar" }
      ];
      localStorage.setItem("complaints", JSON.stringify(complaints));
    }
  }

  loadData();
  initEvents();
  renderComplaints();
}

document.addEventListener("DOMContentLoaded", () => {
  initComplaints();
});

function initComplaints() {
  const complaints = [
    {
      id: "1",
      date: "2025-05-10",
      client: "Carlos Pérez",
      email: "carlos.perez@example.com",
      phone: "987654321",
      subject: "Demora en la atención",
      status: "pendiente",
      vet: "Dra. Ana Torres",
      message: "Esperé más de 30 minutos para ser atendido."
    },
    {
      id: "2",
      date: "2025-05-11",
      client: "Lucía Fernández",
      email: "lucia.fernandez@example.com",
      phone: "987123456",
      subject: "Maltrato al animal",
      status: "resuelta",
      vet: "Dr. Juan Ríos",
      message: "Mi gato salió asustado y con arañazos."
    },
    {
      id: "3",
      date: "2025-05-12",
      client: "Pedro Gómez",
      email: "pedro.gomez@example.com",
      phone: "981234567",
      subject: "Cobro incorrecto",
      status: "pendiente",
      vet: "Dra. Ana Torres",
      message: "Me cobraron un servicio que no solicité."
    },
    {
  id: "4",
  date: "2025-05-13",
  client: "María López",
  email: "maria.lopez@example.com",
  phone: "987888777",
  subject: "Falta de información",
  status: "pendiente",
  vet: "Dr. Javier Morales",
  message: "No me explicaron adecuadamente el tratamiento de mi mascota."
},
{
  id: "5",
  date: "2025-05-14",
  client: "Andrés Salazar",
  email: "andres.salazar@example.com",
  phone: "984556677",
  subject: "Cobro duplicado",
  status: "resuelta",
  vet: "Dra. Ana Torres",
  message: "Se me cobró dos veces por el mismo procedimiento."
},
{
  id: "6",
  date: "2025-05-15",
  client: "Verónica Ramírez",
  email: "veronica.ramirez@example.com",
  phone: "986443322",
  subject: "Mala atención telefónica",
  status: "pendiente",
  vet: "Dr. Juan Ríos",
  message: "La persona que atendió mi llamada fue grosera y poco clara."
}

  ];

  function renderTable() {
    const body = document.getElementById("complaintsBody");
    const statusFilter = document.getElementById("statusFilter").value;
    const query = document.getElementById("searchInput").value.toLowerCase();

    const filtered = complaints.filter(c =>
      (statusFilter === "todas" || c.status === statusFilter) &&
      (!query || [c.client, c.email, c.subject].some(f => f.toLowerCase().includes(query)))
    );

    body.innerHTML = filtered.length === 0
      ? `<tr><td colspan="8" class="p-4 text-center text-gray-500">No se encontraron quejas.</td></tr>`
      : filtered.map(c => `
        <tr class="hover:bg-gray-50">
          <td class="p-3 text-sm">${new Date(c.date).toLocaleDateString("es-ES")}</td>
          <td class="p-3 text-sm">${c.client}</td>
          <td class="p-3 text-sm">${c.email}</td>
          <td class="p-3 text-sm">${c.phone}</td>
          <td class="p-3 text-sm">${c.subject}</td>
          <td class="p-3 text-sm">
            <span class="px-2 py-1 text-xs rounded-full font-medium ${c.status === "pendiente" ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-green-100 text-green-800 border border-green-300'}">
              ${c.status.charAt(0).toUpperCase() + c.status.slice(1)}
            </span>
          </td>
          <td class="p-3 text-sm">${c.vet}</td>
          <td class="p-3">
            <button onclick="showComplaint('${c.id}')" class="px-2 py-1 text-sm border rounded flex items-center gap-1 text-blue-600 border-blue-400 hover:bg-blue-50 transition">
              <span class="material-icons text-sm"></span> Ver
            </button>
          </td>
        </tr>
      `).join("");

    document.getElementById("resultCount").textContent = `${filtered.length} resultado(s)`;
  }

  window.showComplaint = function(id) {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return;

    const content = document.getElementById("modalContent");
    content.innerHTML = `
      <p><strong>Cliente:</strong> ${complaint.client}</p>
      <p><strong>Correo:</strong> ${complaint.email}</p>
      <p><strong>Celular:</strong> ${complaint.phone}</p>
      <p><strong>Veterinario:</strong> ${complaint.vet}</p>
      <p><strong>Fecha:</strong> ${new Date(complaint.date).toLocaleDateString("es-ES")}</p>
      <p><strong>Asunto:</strong> ${complaint.subject}</p>
      <p><strong>Mensaje:</strong> ${complaint.message}</p>
    `;

    const actions = document.getElementById("modalActions");
    actions.classList.toggle("hidden", complaint.status === "resuelta");
    actions.dataset.id = complaint.id;

    document.getElementById("complaintModal").classList.remove("hidden");
  }

  window.closeModal = function() {
    document.getElementById("complaintModal").classList.add("hidden");
  }

  window.markAsResolved = function() {
    const id = document.getElementById("modalActions").dataset.id;
    const index = complaints.findIndex(c => c.id === id);
    if (index !== -1) {
      complaints[index].status = "resuelta";
      showToast("Queja marcada como resuelta.");
      closeModal();
      renderTable();
    }
  }

  document.getElementById("complaintModal").addEventListener("click", e => {
    if (e.target.id === "complaintModal") {
      closeModal();
    }
  });

  function showToast(msg) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast bg-green-500 text-white px-4 py-2 rounded shadow";
    toast.textContent = msg;
    container.appendChild(toast);
    setTimeout(() => container.removeChild(toast), 3000);
  }

  document.getElementById("statusFilter").addEventListener("input", renderTable);
  document.getElementById("searchInput").addEventListener("input", renderTable);
  renderTable();
}

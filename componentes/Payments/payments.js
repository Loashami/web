function initComponent() {
  const $ = id => document.getElementById(id);
  if (!$('#payments-table')) return; // ← no ejecutar si no es la vista de pagos

  const payments = [ /* … tus datos … */ ]; // ← omito aquí por brevedad

  // Helpers (idénticos)
  const getMethodLabel = (method) => { /* igual */ };
  const getStatusClass = (status) => { /* igual */ };
  const getStatusLabel = (status) => { /* igual */ };

  function renderTable() {
    const date = $('#filter-date')?.value;
    const status = $('#status-filter')?.value;
    const method = $('#method-filter')?.value;
    const query = $('#search-query')?.value.toLowerCase();

    const filtered = payments.filter((p) => {
      const matchesDate = !date || p.date.startsWith(date);
      const matchesStatus = status === "all" || p.status === status;
      const matchesMethod = method === "all" || p.method === method;
      const matchesQuery =
        !query || [p.client, p.service, p.reference].some(f => f.toLowerCase().includes(query));
      return matchesDate && matchesStatus && matchesMethod && matchesQuery;
    });

    const total = filtered.reduce((sum, p) => p.status === "completed" ? sum + p.amount : sum, 0);
    $('#total-amount').textContent = `S/ ${total.toFixed(2)}`;

    if (date) {
      const [year, month] = date.split("-");
      const monthName = new Date(Number(year), Number(month) - 1, 1).toLocaleString("es-ES", { month: "long" });
      $('#summary-date').textContent = `${monthName} ${year}`;
    } else {
      $('#summary-date').textContent = "Este mes";
    }

    const tbody = $('#payments-table');
    tbody.innerHTML = filtered.length === 0
      ? `<tr><td colspan="8" class="p-4 text-center text-gray-500">No se encontraron pagos para este periodo.</td></tr>`
      : filtered.map((p) => `
        <tr class="border-b fade-in">
          <td class="p-2">${new Date(p.date).toLocaleDateString("es-ES")}</td>
          <td class="p-2 font-medium">${p.client}</td>
          <td class="p-2">${p.service}</td>
          <td class="p-2">S/ ${p.amount.toFixed(2)}</td>
          <td class="p-2">${getMethodLabel(p.method)}</td>
          <td class="p-2">
            <span class="${getStatusClass(p.status)} inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              <span class="material-icons text-xs">info</span> ${getStatusLabel(p.status)}
            </span>
          </td>
          <td class="p-2 font-mono text-xs">${p.reference}</td>
          <td class="p-2">
            <button data-id="${p.id}" class="ver-btn px-2 py-1 text-sm border rounded flex items-center gap-1 text-blue-600 border-blue-400 hover:bg-blue-50 transition">
              <span class="material-icons text-sm">visibility</span> Ver
            </button>
          </td>
        </tr>
      `).join("");

    document.querySelectorAll(".ver-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        showDetails(id);
      });
    });
  }

  function showDetails(id) {
    const pago = payments.find(p => p.id === id);
    if (!pago) return;

    $('#modal-client').textContent = pago.client;
    $('#modal-service').textContent = pago.service;
    $('#modal-amount').textContent = `S/ ${pago.amount.toFixed(2)}`;
    $('#modal-method').textContent = getMethodLabel(pago.method);
    $('#modal-status').innerHTML = `
      <span class="${getStatusClass(pago.status)} inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
        <span class="material-icons text-xs">info</span> ${getStatusLabel(pago.status)}
      </span>`;
    $('#modal-reference').textContent = pago.reference;
    $('#modal-date').textContent = new Date(pago.date).toLocaleDateString("es-ES");

    $('#payment-modal').classList.remove("hidden");
  }

  $('#modal-close')?.addEventListener("click", () => $('#payment-modal')?.classList.add("hidden"));
  $('#payment-modal')?.addEventListener("click", (e) => {
    if (e.target.id === "payment-modal") $('#payment-modal').classList.add("hidden");
  });

  $('#btn-print')?.addEventListener("click", () => window.print());

  $('#btn-excel')?.addEventListener("click", () => {
    const wb = XLSX.utils.book_new();
    const wsData = [["Fecha", "Cliente", "Servicio", "Monto", "Método", "Estado", "Referencia"]];
    payments.forEach((p) => {
      wsData.push([
        p.date, p.client, p.service, p.amount,
        getMethodLabel(p.method), getStatusLabel(p.status), p.reference
      ]);
    });
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Pagos");
    XLSX.writeFile(wb, "reporte_pagos.xlsx");
  });

  $('#btn-pdf')?.addEventListener("click", () => {
    const element = document.querySelector(".container");
    if (!element) return;
    const opt = {
      margin: 0.5,
      filename: "reporte_pagos.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  });

  // Filtros
  ["filter-date", "status-filter", "method-filter", "search-query"].forEach((id) => {
    $(`#${id}`)?.addEventListener("input", renderTable);
  });

  // Inicialización
  const today = new Date();
  if ($('#filter-date')) {
    $('#filter-date').value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  }
  renderTable();
}

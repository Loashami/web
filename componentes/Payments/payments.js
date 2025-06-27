function initComponent() {
  const payments = [
    {
      id: "1",
      date: "2025-05-18",
      client: "Juan Pérez",
      amount: 85,
      service: "Vacunación",
      method: "credit_card",
      status: "completed",
      reference: "PAY-1234567890",
    },
    {
      id: "2",
      date: "2025-05-17",
      client: "Ana Torres",
      amount: 120,
      service: "Limpieza dental",
      method: "paypal",
      status: "completed",
      reference: "PAY-0987654321",
    },
    {
      id: "3",
      date: "2025-05-16",
      client: "Carlos Gómez",
      amount: 50,
      service: "Chequeo general",
      method: "cash",
      status: "completed",
      reference: "PAY-5678901234",
    },
    {
      id: "4",
      date: "2025-05-15",
      client: "Laura Díaz",
      amount: 35,
      service: "Vacunación",
      method: "credit_card",
      status: "completed",
      reference: "PAY-3456789012",
    },
    {
      id: "5",
      date: "2025-05-14",
      client: "David Romero",
      amount: 70,
      service: "Peluquería",
      method: "credit_card",
      status: "pending",
      reference: "PAY-9012345678",
    },
    {
      id: "6",
      date: "2025-05-13",
      client: "Camila Flores",
      amount: 200,
      service: "Esterilización",
      method: "credit_card",
      status: "pending",
      reference: "PAY-6789012345",
    },
  ];

  const getMethodLabel = (method) => {
    switch (method) {
      case "credit_card":
        return "💳 Tarjeta de crédito";
      case "paypal":
        return "🅿️ PayPal";
      case "cash":
        return "💵 Efectivo";
      default:
        return method;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "refunded":
        return "bg-red-100 text-red-700 border border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Completado";
      case "pending":
        return "Pendiente";
      case "refunded":
        return "Reembolsado";
      default:
        return status;
    }
  };

  function renderTable() {
    const date = document.getElementById("filter-date").value;
    const status = document.getElementById("status-filter").value;
    const method = document.getElementById("method-filter").value;
    const query = document.getElementById("search-query").value.toLowerCase();

    const filtered = payments.filter((p) => {
      const matchesDate = !date || p.date.startsWith(date);
      const matchesStatus = status === "all" || p.status === status;
      const matchesMethod = method === "all" || p.method === method;
      const matchesQuery =
        !query ||
        [p.client, p.service, p.reference].some((field) =>
          field.toLowerCase().includes(query)
        );
      return matchesDate && matchesStatus && matchesMethod && matchesQuery;
    });

    const total = filtered.reduce((sum, p) => (p.status === "completed" ? sum + p.amount : sum),0);
    document.getElementById("total-amount").textContent = `S/ ${total.toFixed(2)}`;

    if (date) {
      const [year, month] = date.split("-");
      const monthName = new Date( Number(year),Number(month) - 1, 1).toLocaleString("es-ES", { month: "long" });
      document.getElementById(
        "summary-date"
      ).textContent = `${monthName} ${year}`;
    } else {
      document.getElementById("summary-date").textContent = "Este mes";
    }

    const tbody = document.getElementById("payments-table");
    tbody.innerHTML =
      filtered.length === 0
        ? `<tr><td colspan="8" class="p-4 text-center text-gray-500">No se encontraron pagos para este periodo.</td></tr>`
        : filtered
            .map(
              (p) => `
        <tr class="border-b fade-in">
          <td class="p-2">${new Date(p.date).toLocaleDateString("es-ES")}</td>
          <td class="p-2 font-medium">${p.client}</td>
          <td class="p-2">${p.service}</td>
          <td class="p-2">S/ ${p.amount.toFixed(2)}</td>
          <td class="p-2">${getMethodLabel(p.method)}</td>
          <td class="p-2">
            <span class="${getStatusClass(
              p.status
            )} inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
              <span class="material-icons text-xs">info</span> ${getStatusLabel(
                p.status
              )}
            </span>
          </td>
          <td class="p-2 font-mono text-xs">${p.reference}</td>
          <td class="p-2">
            <button data-id="${
              p.id
            }" class="ver-btn px-2 py-1 text-sm border rounded flex items-center gap-1 text-blue-600 border-blue-400 hover:bg-blue-50 transition">
              <span class="material-icons text-sm">visibility</span> Ver
            </button>
          </td>
        </tr>
      `
            )
            .join("");

    document.querySelectorAll(".ver-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        showDetails(id);
      });
    });
  }

  function showDetails(id) {
    const pago = payments.find((p) => p.id === id);
    if (!pago) return;

    document.getElementById("modal-client").textContent = pago.client;
    document.getElementById("modal-service").textContent = pago.service;
    document.getElementById(
      "modal-amount"
    ).textContent = `S/ ${pago.amount.toFixed(2)}`;
    document.getElementById("modal-method").textContent = getMethodLabel(
      pago.method
    );
    document.getElementById("modal-status").innerHTML = `
      <span class="${getStatusClass(
        pago.status
      )} inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium shadow-sm">
        <span class="material-icons text-xs">info</span> ${getStatusLabel(
          pago.status
        )}
      </span>`;
    document.getElementById("modal-reference").textContent = pago.reference;
    document.getElementById("modal-date").textContent = new Date(
      pago.date
    ).toLocaleDateString("es-ES");

    document.getElementById("payment-modal").classList.remove("hidden");
  }

  document.getElementById("modal-close").addEventListener("click", () => {
    document.getElementById("payment-modal").classList.add("hidden");
  });

  document.getElementById("payment-modal").addEventListener("click", (e) => {
    if (e.target.id === "payment-modal") {
      document.getElementById("payment-modal").classList.add("hidden");
    }
  });

  document
    .getElementById("btn-print")
    .addEventListener("click", () => window.print());

  document.getElementById("btn-excel").addEventListener("click", () => {
    const wb = XLSX.utils.book_new();
    const wsData = [
      [
        "Fecha",
        "Cliente",
        "Servicio",
        "Monto",
        "Método",
        "Estado",
        "Referencia",
      ],
    ];
    payments.forEach((p) => {
      wsData.push([
        p.date,
        p.client,
        p.service,
        p.amount,
        getMethodLabel(p.method),
        getStatusLabel(p.status),
        p.reference,
      ]);
    });
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Pagos");
    XLSX.writeFile(wb, "reporte_pagos.xlsx");
  });

  document.getElementById("btn-pdf").addEventListener("click", () => {
    const element = document.querySelector(".container");
    const opt = {
      margin: 0.5,
      filename: "reporte_pagos.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };
    html2pdf().set(opt).from(element).save();
  });

  // Eventos para filtros
  ["filter-date", "status-filter", "method-filter", "search-query"].forEach(
    (id) => {
      document.getElementById(id).addEventListener("input", renderTable);
    }
  );

  const today = new Date();
  document.getElementById(
    "filter-date"
  ).value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
    2,
    "0"
  )}`;
  renderTable();
}
document.addEventListener("DOMContentLoaded", initComponent);

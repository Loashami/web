
function initComponent() {
    const payments = [
      { id: "1", date: "2025-05-18", client: "John Doe", amount: 85, service: "Vaccination", method: "credit_card", status: "completed", reference: "PAY-1234567890" },
      { id: "2", date: "2025-05-17", client: "Sarah Smith", amount: 120, service: "Dental Cleaning", method: "paypal", status: "completed", reference: "PAY-0987654321" },
      { id: "3", date: "2025-05-16", client: "Michael Johnson", amount: 50, service: "General Check-up", method: "cash", status: "completed", reference: "PAY-5678901234" },
      { id: "4", date: "2025-05-15", client: "Emily Davis", amount: 35, service: "Vaccination", method: "credit_card", status: "completed", reference: "PAY-3456789012" },
      { id: "5", date: "2025-05-14", client: "David Wilson", amount: 70, service: "Grooming", method: "credit_card", status: "refunded", reference: "PAY-9012345678" },
      { id: "6", date: "2025-05-13", client: "Jennifer Brown", amount: 200, service: "Spay/Neuter", method: "credit_card", status: "pending", reference: "PAY-6789012345" },
    ];

    const getMethodLabel = (method) => {
      switch (method) {
        case "credit_card": return "Credit Card";
        case "paypal": return "PayPal";
        case "cash": return "Cash";
        default: return method;
      }
    };

    const getStatusClass = (status) => {
      switch (status) {
        case "completed": return "bg-green-500";
        case "pending": return "bg-yellow-500";
        case "refunded": return "bg-red-500";
        default: return "bg-gray-500";
      }
    };

    const renderTable = () => {
      const date = document.getElementById("filter-date").value;
      const status = document.getElementById("status-filter").value;
      const method = document.getElementById("method-filter").value;
      const query = document.getElementById("search-query").value.toLowerCase();

      const filtered = payments.filter(p => {
        const matchesDate = !date || p.date.startsWith(date);
        const matchesStatus = status === "all" || p.status === status;
        const matchesMethod = method === "all" || p.method === method;
        const matchesQuery = !query || [p.client, p.service, p.reference].some(field => field.toLowerCase().includes(query));
        return matchesDate && matchesStatus && matchesMethod && matchesQuery;
      });

      const total = filtered.reduce((sum, p) => p.status !== "refunded" ? sum + p.amount : sum, 0);
      document.getElementById("total-amount").textContent = `$${total.toFixed(2)}`;
      document.getElementById("summary-date").textContent = date ? new Date(date + "-01").toLocaleString("default", { month: "long", year: "numeric" }) : "This month";

      const tbody = document.getElementById("payments-table");
      tbody.innerHTML = filtered.length === 0
        ? `<tr><td colspan="8" class="p-4 text-center">No payments found for this period.</td></tr>`
        : filtered.map(p => `
          <tr class="border-b">
            <td class="p-2">${new Date(p.date).toLocaleDateString()}</td>
            <td class="p-2 font-medium">${p.client}</td>
            <td class="p-2">${p.service}</td>
            <td class="p-2">$${p.amount.toFixed(2)}</td>
            <td class="p-2">${getMethodLabel(p.method)}</td>
            <td class="p-2"><span class="badge ${getStatusClass(p.status)}">${p.status.charAt(0).toUpperCase() + p.status.slice(1)}</span></td>
            <td class="p-2 font-mono text-xs">${p.reference}</td>
            <td class="p-2 space-x-2">
              <button class="px-2 py-1 text-sm border rounded">View</button>
              ${p.status === "pending" ? `<button class="px-2 py-1 text-sm border border-green-500 text-green-500 rounded">Approve</button>` : ""}
              ${p.status !== "refunded" ? `<button class="px-2 py-1 text-sm border border-red-500 text-red-500 rounded">Refund</button>` : ""}
            </td>
          </tr>
        `).join("");
    };

    document.querySelectorAll("#filter-date, #status-filter, #method-filter, #search-query").forEach(el => {
      el.addEventListener("input", renderTable);
    });

    document.addEventListener("DOMContentLoaded", () => {
      const today = new Date();
      document.getElementById("filter-date").value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
      renderTable();
    });
  }
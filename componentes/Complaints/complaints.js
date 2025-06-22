
  let complaints = [];
  let selectedComplaint = null;

  function getStatusColor(status) {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "completed": return "bg-gray-200 text-gray-800";
      default: return "bg-gray-100 text-gray-700";
    }
  }

  function renderComplaints() {
    const body = document.getElementById("complaintsBody");
    const search = document.getElementById("searchInput").value.toLowerCase();
    const status = document.getElementById("statusFilter").value;
    const priority = document.getElementById("priorityFilter").value;

    const filtered = complaints.filter(c => {
      const matchesStatus = status === "all" || c.status === status;
      const matchesPriority = priority === "all" || c.priority === priority;
      const matchesSearch = c.client.toLowerCase().includes(search) || c.subject.toLowerCase().includes(search);
      return matchesStatus && matchesPriority && matchesSearch;
    });

    body.innerHTML = filtered.map(c => `
      <tr class="hover:bg-gray-50">
        <td class="p-3">${new Date(c.date).toLocaleDateString()}</td>
        <td class="p-3 font-medium">${c.client}</td>
        <td class="p-3 truncate max-w-[200px]">${c.subject}</td>
        <td class="p-3 capitalize">${c.priority}</td>
        <td class="p-3">
          <span class="px-2 py-1 rounded text-xs font-semibold ${getStatusColor(c.status)}">
            ${c.status.replace("-", " ")}
          </span>
        </td>
        <td class="p-3">${c.assignedTo}</td>
        <td class="p-3">
          <button data-id="${c.id}" class="view-btn px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm">View</button>
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
  }

  function showModal(complaint) {
    selectedComplaint = complaint;
    document.getElementById("complaintModal").classList.remove("hidden");
    document.body.classList.add("modal-open");

    const content = document.getElementById("modalContent");
    const responseInput = document.getElementById("responseText");
    const actions = document.getElementById("modalActions");

    content.innerHTML = `
      <p><strong>Client:</strong> ${complaint.client}</p>
      <p><strong>Status:</strong> ${complaint.status}</p>
      <p><strong>Priority:</strong> ${complaint.priority}</p>
      <p><strong>Assigned To:</strong> ${complaint.assignedTo}</p>
      <p><strong>Subject:</strong> ${complaint.subject}</p>
      <p><strong>Description:</strong> ${complaint.description}</p>
      ${complaint.response ? `<div class="bg-gray-100 p-3 rounded text-sm"><strong>Response:</strong> ${complaint.response}</div>` : ""}
    `;

    if (complaint.status === "resolved" || complaint.status === "completed") {
      responseInput.classList.add("hidden");
      actions.classList.add("hidden");
    } else {
      responseInput.classList.remove("hidden");
      actions.classList.remove("hidden");
      responseInput.value = complaint.response || "";
    }
  }

  function closeModal() {
    document.getElementById("complaintModal").classList.add("hidden");
    document.body.classList.remove("modal-open");
  }

  function markAsCompleted() {
    const response = document.getElementById("responseText").value.trim();
    if (selectedComplaint) {
      selectedComplaint.status = "completed";
      if (response) selectedComplaint.response = response;
      localStorage.setItem("complaints", JSON.stringify(complaints));
      renderComplaints();
      closeModal();
      showToast("Complaint marked as completed!");
    }
  }

  function showToast(message) {
    const container = document.getElementById("toastContainer");
    const toast = document.createElement("div");
    toast.className = "toast px-4 py-2 bg-green-600 text-white rounded shadow";
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  function initComponent() {
    complaints = JSON.parse(localStorage.getItem("complaints")) || [
      { id: "1", date: "2025-05-18", client: "John Doe", subject: "Long wait time", description: "Waited 45 mins.", status: "pending", priority: "medium", assignedTo: "Robert Wilson" },
      { id: "2", date: "2025-05-17", client: "Sarah Smith", subject: "Billing discrepancy", description: "Charged incorrectly.", status: "in-progress", priority: "high", assignedTo: "Robert Wilson" },
      { id: "3", date: "2025-05-15", client: "Michael Johnson", subject: "Rude staff", description: "Receptionist rude.", status: "resolved", priority: "medium", assignedTo: "Lisa Patel", response: "We apologize. The staff has been reminded about professional behavior." },
      { id: "4", date: "2025-05-14", client: "Emily Davis", subject: "Incorrect medication", description: "Wrong prescription.", status: "in-progress", priority: "critical", assignedTo: "Robert Wilson" },
      { id: "5", date: "2025-05-12", client: "David Wilson", subject: "Cleanliness concerns", description: "Room was dirty.", status: "completed", priority: "low", assignedTo: "Lisa Patel", response: "Thank you. We’ve addressed the issue with our cleaning staff." }
    ];

    document.getElementById("searchInput").addEventListener("input", renderComplaints);
    document.getElementById("statusFilter").addEventListener("change", renderComplaints);
    document.getElementById("priorityFilter").addEventListener("change", renderComplaints);

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

    renderComplaints();
  }

  document.addEventListener("DOMContentLoaded", initComponent);

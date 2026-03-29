
    const complaints = [
      { id: "1", date: "2025-05-18", client: "John Doe", subject: "Long wait time", description: "Waited 45 mins.", status: "pending", priority: "medium", assignedTo: "Robert Wilson" },
      { id: "2", date: "2025-05-17", client: "Sarah Smith", subject: "Billing discrepancy", description: "Charged incorrectly.", status: "in-progress", priority: "high", assignedTo: "Robert Wilson" },
      { id: "3", date: "2025-05-15", client: "Michael Johnson", subject: "Rude staff", description: "Receptionist rude.", status: "resolved", priority: "medium", assignedTo: "Lisa Patel" },
      { id: "4", date: "2025-05-14", client: "Emily Davis", subject: "Incorrect medication", description: "Wrong prescription.", status: "in-progress", priority: "critical", assignedTo: "Robert Wilson" },
      { id: "5", date: "2025-05-12", client: "David Wilson", subject: "Cleanliness concerns", description: "Room was dirty.", status: "resolved", priority: "low", assignedTo: "Lisa Patel" },
    ];

    const body = document.getElementById("complaintsBody");
    const searchInput = document.getElementById("searchInput");
    const statusFilter = document.getElementById("statusFilter");
    const priorityFilter = document.getElementById("priorityFilter");

    function renderComplaints() {
      const search = searchInput.value.toLowerCase();
      const status = statusFilter.value;
      const priority = priorityFilter.value;

      const filtered = complaints.filter(c => {
        const matchesStatus = status === "all" || c.status === status;
        const matchesPriority = priority === "all" || c.priority === priority;
        const matchesSearch = c.client.toLowerCase().includes(search) || c.subject.toLowerCase().includes(search);
        return matchesStatus && matchesPriority && matchesSearch;
      });

      body.innerHTML = filtered.map(c => `
        <tr>
          <td class="p-3">${new Date(c.date).toLocaleDateString()}</td>
          <td class="p-3 font-medium">${c.client}</td>
          <td class="p-3 truncate max-w-[200px]">${c.subject}</td>
          <td class="p-3 capitalize">${c.priority}</td>
          <td class="p-3 capitalize">${c.status.replace("-", " ")}</td>
          <td class="p-3">${c.assignedTo}</td>
          <td class="p-3">
            <button onclick='showModal(${JSON.stringify(c)})' class="px-2 py-1 border text-sm rounded">View</button>
          </td>
        </tr>
      `).join("");
    }

    function showModal(complaint) {
      document.getElementById("complaintModal").classList.remove("hidden");
      document.getElementById("modalContent").innerHTML = `
        <p><strong>Client:</strong> ${complaint.client}</p>
        <p><strong>Status:</strong> ${complaint.status}</p>
        <p><strong>Priority:</strong> ${complaint.priority}</p>
        <p><strong>Assigned To:</strong> ${complaint.assignedTo}</p>
        <p><strong>Subject:</strong> ${complaint.subject}</p>
        <p><strong>Description:</strong> ${complaint.description}</p>
      `;
    }

    function closeModal() {
      document.getElementById("complaintModal").classList.add("hidden");
    }

    searchInput.addEventListener("input", renderComplaints);
    statusFilter.addEventListener("change", renderComplaints);
    priorityFilter.addEventListener("change", renderComplaints);

    renderComplaints();

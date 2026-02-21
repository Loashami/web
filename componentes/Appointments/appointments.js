function initComponent() {
    const appointments = [
      { id: "1", date: "2025-05-20", time: "10:00 AM", client: "John Doe", pet: "Max (Dog)", petType: "Golden Retriever, 5 years", service: "Vaccination", doctor: "Dr. Sarah Johnson", status: "confirmed" },
      { id: "2", date: "2025-05-20", time: "11:30 AM", client: "Sarah Smith", pet: "Bella (Cat)", petType: "Siamese, 3 years", service: "Check-up", doctor: "Dr. Michael Chen", status: "confirmed" },
      { id: "3", date: "2025-05-20", time: "2:00 PM", client: "Michael Johnson", pet: "Rocky (Dog)", petType: "Bulldog, 2 years", service: "Dental Cleaning", doctor: "Dr. Emily Rodriguez", status: "confirmed" },
      { id: "4", date: "2025-05-21", time: "9:30 AM", client: "Emily Davis", pet: "Luna (Cat)", petType: "Maine Coon, 4 years", service: "Vaccination", doctor: "Dr. Sarah Johnson", status: "confirmed" },
      { id: "5", date: "2025-05-21", time: "1:00 PM", client: "David Wilson", pet: "Charlie (Bird)", petType: "Cockatiel, 1 year", service: "Wing Trimming", doctor: "Dr. David Kim", status: "confirmed" },
      { id: "6", date: "2025-05-22", time: "10:00 AM", client: "Jennifer Brown", pet: "Cooper (Dog)", petType: "Beagle, 6 years", service: "Check-up", doctor: "Dr. Sarah Johnson", status: "confirmed" },
      { id: "7", date: "2025-05-19", time: "3:30 PM", client: "Robert Garcia", pet: "Daisy (Dog)", petType: "Poodle, 4 years", service: "Grooming", doctor: "Dr. Michael Chen", status: "completed" },
      { id: "8", date: "2025-05-19", time: "2:00 PM", client: "Amanda Lee", pet: "Oliver (Cat)", petType: "Tabby, 2 years", service: "Vaccination", doctor: "Dr. Emily Rodriguez", status: "completed" },
      { id: "9", date: "2025-05-18", time: "11:00 AM", client: "Thomas Martinez", pet: "Milo (Dog)", petType: "Labrador, 3 years", service: "Check-up", doctor: "Dr. David Kim", status: "cancelled" },
    ];

    const dateInput = document.getElementById("filter-date");
    const statusSelect = document.getElementById("filter-status");
    const doctorSelect = document.getElementById("filter-doctor");
    const searchInput = document.getElementById("search-query");
    const tbody = document.getElementById("appointment-body");

    const getUniqueDoctors = () => {
      const unique = [...new Set(appointments.map(a => a.doctor))];
      unique.forEach(doctor => {
        const opt = document.createElement("option");
        opt.value = doctor;
        opt.textContent = doctor;
        doctorSelect.appendChild(opt);
      });
    };

    const renderAppointments = () => {
      const date = dateInput.value;
      const status = statusSelect.value;
      const doctor = doctorSelect.value;
      const query = searchInput.value.toLowerCase();

      const filtered = appointments.filter(a => {
        const matchDate = date ? a.date === date : true;
        const matchStatus = status === "all" || a.status === status;
        const matchDoctor = doctor === "all" || a.doctor === doctor;
        const matchSearch =
          !query ||
          a.client.toLowerCase().includes(query) ||
          a.pet.toLowerCase().includes(query) ||
          a.service.toLowerCase().includes(query);
        return matchDate && matchStatus && matchDoctor && matchSearch;
      });

      tbody.innerHTML = "";
      if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="text-center p-4">No appointments found for this date.</td></tr>`;
        return;
      }

      filtered.forEach(a => {
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
            <span class="px-2 py-1 rounded text-white text-xs ${a.status === "confirmed" ? "bg-blue-500" : a.status === "completed" ? "bg-green-500" : "bg-red-500"}">
              ${a.status.charAt(0).toUpperCase() + a.status.slice(1)}
            </span>
          </td>
          <td class="p-4">
            <button class="px-2 py-1 text-sm border rounded mr-2">Edit</button>
            ${a.status === "confirmed" ? '<button class="px-2 py-1 text-sm border border-red-500 text-red-500 rounded">Cancel</button>' : ''}
          </td>
        `;
        tbody.appendChild(tr);
      });
    };

    getUniqueDoctors();
    [dateInput, statusSelect, doctorSelect, searchInput].forEach(el => el.addEventListener("input", renderAppointments));
    renderAppointments();
  }

    const services = [
      { id: "1", name: "General Check-up", description: "Comprehensive physical examination and health assessment", duration: 30, price: 50, category: "wellness", status: "active" },
      { id: "2", name: "Vaccination", description: "Administration of core and non-core vaccines", duration: 15, price: 35, category: "wellness", status: "active" },
      { id: "3", name: "Dental Cleaning", description: "Professional dental cleaning under anesthesia", duration: 60, price: 120, category: "dental", status: "active" },
      { id: "4", name: "Spay/Neuter", description: "Surgical sterilization procedure", duration: 90, price: 200, category: "surgery", status: "active" },
      { id: "5", name: "X-Ray", description: "Diagnostic imaging service", duration: 30, price: 85, category: "diagnostic", status: "active" },
      { id: "6", name: "Microchipping", description: "Implantation of identification microchip", duration: 15, price: 45, category: "wellness", status: "active" },
      { id: "7", name: "Grooming", description: "Professional grooming services including bath, haircut, and nail trimming", duration: 60, price: 70, category: "grooming", status: "active" },
      { id: "8", name: "Allergy Testing", description: "Comprehensive testing for environmental and food allergies", duration: 45, price: 150, category: "diagnostic", status: "inactive" }
    ];

    const servicesTableBody = document.getElementById("servicesTableBody");
    const searchInput = document.getElementById("searchInput");
    const dialog = document.getElementById("dialog");
    const openDialog = document.getElementById("openDialog");
    const cancelDialog = document.getElementById("cancelDialog");
    const serviceForm = document.getElementById("serviceForm");

    function renderServices(query = "") {
      servicesTableBody.innerHTML = "";
      const filtered = services.filter(service => {
        const str = `${service.name} ${service.description} ${service.category}`.toLowerCase();
        return str.includes(query.toLowerCase());
      });

      if (filtered.length === 0) {
        servicesTableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4">No services found.</td></tr>`;
        return;
      }

      filtered.forEach(service => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="px-4 py-2 font-medium">${service.name}</td>
          <td class="px-4 py-2 max-w-xs truncate">${service.description}</td>
          <td class="px-4 py-2">${service.duration} min</td>
          <td class="px-4 py-2">$${service.price}</td>
          <td class="px-4 py-2 capitalize">${service.category}</td>
          <td class="px-4 py-2">
            <span class="px-2 py-1 rounded text-white text-sm ${service.status === "active" ? "bg-green-500" : "bg-gray-500"}">${service.status}</span>
          </td>
          <td class="px-4 py-2 space-x-2">
            <button class="text-blue-600 hover:underline">Edit</button>
            <button class="${service.status === "active" ? "text-red-500" : "text-green-500"} hover:underline">
              ${service.status === "active" ? "Deactivate" : "Activate"}
            </button>
          </td>
        `;
        servicesTableBody.appendChild(row);
      });
    }

    searchInput.addEventListener("input", () => renderServices(searchInput.value));
    openDialog.addEventListener("click", () => dialog.classList.remove("hidden"));
    cancelDialog.addEventListener("click", () => dialog.classList.add("hidden"));

    serviceForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const formData = new FormData(serviceForm);
      const newService = {
        id: (services.length + 1).toString(),
        name: formData.get("name"),
        description: formData.get("description"),
        duration: Number(formData.get("duration")),
        price: Number(formData.get("price")),
        category: formData.get("category"),
        status: "active",
      };
      services.push(newService);
      renderServices(searchInput.value);
      dialog.classList.add("hidden");
      serviceForm.reset();
    });

    renderServices();
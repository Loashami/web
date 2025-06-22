
    function initComponent() {
      const services = [
        { id: "1", name: "General Check-up", description: "Comprehensive physical examination and health assessment", duration: 30, price: 50, category: "wellness", status: "active" },
    { id: "2", name: "Vaccination", description: "Administration of core and non-core vaccines", duration: 15, price: 35, category: "wellness", status: "active" },
    { id: "3", name: "Dental Cleaning", description: "Professional dental cleaning under anesthesia", duration: 60, price: 120, category: "dental", status: "active" },
    { id: "4", name: "Spay/Neuter", description: "Surgical sterilization procedure", duration: 90, price: 200, category: "surgery", status: "active" },
    { id: "5", name: "X-Ray", description: "Diagnostic imaging service", duration: 30, price: 85, category: "diagnostic", status: "active" },
    { id: "6", name: "Microchipping", description: "Implantation of identification microchip", duration: 15, price: 45, category: "wellness", status: "active" },
    { id: "7", name: "Grooming", description: "Professional grooming services including bath, haircut, and nail trimming", duration: 60, price: 70, category: "grooming", status: "active" },
    { id: "8", name: "Allergy Testing", description: "Comprehensive testing for environmental and food allergies", duration: 45, price: 150, category: "diagnostic", status: "inactive" }

      ]; // OMITTED for brevity — keep existing services list

      const servicesTableBody = document.getElementById("servicesTableBody");
      const searchInput = document.getElementById("searchInput");
      const dialog = document.getElementById("dialog");
      const openDialog = document.getElementById("openDialog");
      const cancelDialog = document.getElementById("cancelDialog");
      const serviceForm = document.getElementById("serviceForm");
      const spinner = document.getElementById("spinner");
      const editId = document.getElementById("editId");
      const dialogTitle = document.getElementById("dialogTitle");
      const dialogDescription = document.getElementById("dialogDescription");

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
          row.classList.add("hover:bg-gray-50", "transition-colors");
          row.innerHTML = `
            <td class="px-4 py-2 font-medium">${service.name}</td>
            <td class="px-4 py-2 max-w-xs truncate">${service.description}</td>
            <td class="px-4 py-2">${service.duration} min</td>
            <td class="px-4 py-2">$${service.price}</td>
            <td class="px-4 py-2 capitalize">${service.category}</td>
            <td class="px-4 py-2">
              <span class="px-2 py-1 rounded text-white text-sm ${service.status === "active" ? "bg-green-500" : "bg-gray-500"}">${service.status}</span>
            </td>
            <td class="px-4 py-2 flex flex-wrap gap-2">
              <button class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm hover:bg-blue-200" data-id="${service.id}" data-action="edit">Edit</button>
              <button class="bg-${service.status === "active" ? "red" : "green"}-100 text-${service.status === "active" ? "red" : "green"}-800 px-2 py-1 rounded text-sm toggle-status" data-id="${service.id}">
                ${service.status === "active" ? "Deactivate" : "Activate"}
              </button>
              <button class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-200 delete-btn" data-id="${service.id}">Delete</button>
            </td>
          `;

          row.querySelector(".toggle-status").addEventListener("click", () => {
            service.status = service.status === "active" ? "inactive" : "active";
            renderServices(searchInput.value);
          });

          row.querySelector("[data-action='edit']").addEventListener("click", () => {
            editId.value = service.id;
            serviceForm.name.value = service.name;
            serviceForm.description.value = service.description;
            serviceForm.duration.value = service.duration;
            serviceForm.price.value = service.price;
            serviceForm.category.value = service.category;
            dialogTitle.textContent = "Edit Service";
            dialogDescription.textContent = "Update the service details.";
            dialog.classList.remove("hidden");
          });

          row.querySelector(".delete-btn").addEventListener("click", () => {
            if (confirm("Are you sure you want to delete this service?")) {
              const index = services.findIndex(s => s.id === service.id);
              if (index > -1) {
                services.splice(index, 1);
                renderServices(searchInput.value);
              }
            }
          });

          servicesTableBody.appendChild(row);
        });
      }

      searchInput.addEventListener("input", () => renderServices(searchInput.value));
      openDialog.addEventListener("click", () => {
        serviceForm.reset();
        editId.value = "";
        dialogTitle.textContent = "Add New Service";
        dialogDescription.textContent = "Create a new service offering for the clinic.";
        dialog.classList.remove("hidden");
      });
      cancelDialog.addEventListener("click", () => dialog.classList.add("hidden"));

      serviceForm.addEventListener("submit", (e) => {
        e.preventDefault();
        spinner.classList.remove("hidden");
        const formData = new FormData(serviceForm);
        const id = formData.get("editId");
        const name = formData.get("name").trim();
        const isEditing = id !== "";

        if (!isEditing && services.some(s => s.name.toLowerCase() === name.toLowerCase())) {
          alert("A service with this name already exists.");
          spinner.classList.add("hidden");
          return;
        }

        const serviceData = {
          id: isEditing ? id : (services.length + 1).toString(),
          name,
          description: formData.get("description"),
          duration: Number(formData.get("duration")),
          price: Number(formData.get("price")),
          category: formData.get("category"),
          status: isEditing ? services.find(s => s.id === id).status : "active"
        };

        if (isEditing) {
          const index = services.findIndex(s => s.id === id);
          services[index] = serviceData;
        } else {
          services.push(serviceData);
        }

        renderServices(searchInput.value);
        dialog.classList.add("hidden");
        serviceForm.reset();
        spinner.classList.add("hidden");
      });

      renderServices();
    }

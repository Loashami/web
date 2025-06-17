
    const inventory = [
      { id: 1, name: "Rabies Vaccine", category: "Vaccines", quantity: 45, unit: "doses", reorderLevel: 20, expiryDate: "2026-05-20", supplier: "VetMed Supplies", status: "in_stock" },
      { id: 2, name: "Flea & Tick Medication", category: "Medications", quantity: 32, unit: "packages", reorderLevel: 15, expiryDate: "2026-08-15", supplier: "PetPharm", status: "in_stock" },
      { id: 3, name: "Surgical Gloves", category: "Supplies", quantity: 120, unit: "pairs", reorderLevel: 50, expiryDate: "2027-01-10", supplier: "MedEquip", status: "in_stock" },
      { id: 4, name: "Dental Cleaning Kit", category: "Equipment", quantity: 8, unit: "kits", reorderLevel: 5, expiryDate: "2028-12-31", supplier: "DentalVet", status: "in_stock" },
      { id: 5, name: "Heartworm Medication", category: "Medications", quantity: 12, unit: "boxes", reorderLevel: 10, expiryDate: "2026-06-30", supplier: "PetPharm", status: "low_stock" },
      { id: 6, name: "Distemper Vaccine", category: "Vaccines", quantity: 5, unit: "doses", reorderLevel: 15, expiryDate: "2025-12-15", supplier: "VetMed Supplies", status: "low_stock" },
      { id: 7, name: "Microchips", category: "Supplies", quantity: 25, unit: "units", reorderLevel: 20, expiryDate: "2030-01-01", supplier: "PetID Systems", status: "in_stock" },
      { id: 8, name: "Antibiotics - Amoxicillin", category: "Medications", quantity: 0, unit: "bottles", reorderLevel: 10, expiryDate: "2026-03-15", supplier: "PetPharm", status: "out_of_stock" }
    ];

    const inventoryTable = document.getElementById("inventoryTable");
    const categoryFilter = document.getElementById("categoryFilter");
    const statusFilter = document.getElementById("statusFilter");
    const searchInput = document.getElementById("searchInput");

    function toggleModal() {
      document.getElementById("modal").classList.toggle("hidden");
    }

    function getStatusColor(status) {
      switch (status) {
        case "in_stock": return "text-green-600";
        case "low_stock": return "text-yellow-600";
        case "out_of_stock": return "text-red-600";
        default: return "text-gray-600";
      }
    }

    function populateTable() {
      const query = searchInput.value.toLowerCase();
      const category = categoryFilter.value;
      const status = statusFilter.value;

      inventoryTable.innerHTML = "";

      const filtered = inventory.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(query) || item.supplier.toLowerCase().includes(query);
        const matchesCategory = category === "all" || item.category === category;
        const matchesStatus = status === "all" || item.status === status;
        return matchesSearch && matchesCategory && matchesStatus;
      });

      filtered.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td class="p-3 font-medium">${item.name}</td>
          <td class="p-3">${item.category}</td>
          <td class="p-3">${item.quantity} ${item.unit}</td>
          <td class="p-3">${item.reorderLevel}</td>
          <td class="p-3">${new Date(item.expiryDate).toLocaleDateString()}</td>
          <td class="p-3">${item.supplier}</td>
          <td class="p-3 ${getStatusColor(item.status)} font-semibold">${item.status.replaceAll("_", " ")}</td>
        `;
        inventoryTable.appendChild(row);
      });
    }

    document.getElementById("addItemForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const newItem = {
        id: inventory.length + 1,
        name: document.getElementById("name").value,
        category: document.getElementById("category").value,
        quantity: parseInt(document.getElementById("quantity").value),
        unit: document.getElementById("unit").value,
        reorderLevel: parseInt(document.getElementById("reorderLevel").value),
        expiryDate: document.getElementById("expiryDate").value,
        supplier: document.getElementById("supplier").value,
        status: "in_stock",
      };
      inventory.push(newItem);
      populateTable();
      toggleModal();
      e.target.reset();
    });

    [searchInput, categoryFilter, statusFilter].forEach(el => el.addEventListener("input", populateTable));



  document.addEventListener("DOMContentLoaded", function () {
    // Llenar filtro de categorías
    const categories = [...new Set(inventory.map(i => i.category))];
    const categoryFilter = document.getElementById("categoryFilter");
    categories.forEach(cat => {
      const option = document.createElement("option");
      option.value = cat;
      option.textContent = cat;
      categoryFilter.appendChild(option);
    });

    // Mostrar la tabla al cargar
    populateTable();
  });
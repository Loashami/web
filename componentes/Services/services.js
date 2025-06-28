function initComponent() {
  const servicios = [
    { id: "1", name: "Chequeo General", description: "Examen físico completo y evaluación de salud", duration: 30, price: 50, category: "bienestar", status: "activo" },
    { id: "2", name: "Vacunación", description: "Aplicación de vacunas básicas y opcionales", duration: 15, price: 35, category: "bienestar", status: "activo" },
    { id: "3", name: "Limpieza Dental", description: "Limpieza dental profesional bajo anestesia", duration: 60, price: 120, category: "dental", status: "activo" },
    { id: "4", name: "Esterilización", description: "Procedimiento quirúrgico de esterilización", duration: 90, price: 200, category: "cirugía", status: "activo" },
    { id: "5", name: "Radiografía", description: "Servicio de diagnóstico por imágenes", duration: 30, price: 85, category: "diagnóstico", status: "activo" },
    { id: "6", name: "Microchip", description: "Implantación de microchip de identificación", duration: 15, price: 45, category: "bienestar", status: "activo" },
    { id: "7", name: "Estética", description: "Servicios de baño, corte de pelo y uñas", duration: 60, price: 70, category: "estética", status: "activo" },
    { id: "8", name: "Prueba de Alergias", description: "Evaluación completa para alergias alimentarias y ambientales", duration: 45, price: 150, category: "diagnóstico", status: "inactivo" }
  ];

  const tabla = document.getElementById("servicesTableBody");
  const inputBusqueda = document.getElementById("searchInput");
  const modal = document.getElementById("dialog");
  const btnAbrir = document.getElementById("openDialog");
  const btnCancelar = document.getElementById("cancelDialog");
  const formulario = document.getElementById("serviceForm");
  const spinner = document.getElementById("spinner");
  const editId = document.getElementById("editId");
  const dialogTitle = document.getElementById("dialogTitle");
  const dialogDescription = document.getElementById("dialogDescription");

  function renderizarServicios(busqueda = "") {
    tabla.innerHTML = "";
    const filtro = servicios.filter(servicio => {
      const texto = `${servicio.name} ${servicio.description} ${servicio.category}`.toLowerCase();
      return texto.includes(busqueda.toLowerCase());
    });

    if (filtro.length === 0) {
      tabla.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-gray-500">No se encontraron servicios.</td></tr>`;
      return;
    }

    filtro.forEach(servicio => {
      const fila = document.createElement("tr");
      fila.classList.add("hover:bg-gray-50", "transition-colors");
      fila.innerHTML = `
        <td class="px-4 py-2 font-medium">${servicio.name}</td>
        <td class="px-4 py-2 max-w-xs truncate">${servicio.description}</td>
        <td class="px-4 py-2">${servicio.duration} min</td>
        <td class="px-4 py-2">S/. ${servicio.price}</td>
        <td class="px-4 py-2 capitalize">${servicio.category}</td>
        <td class="px-4 py-2">
          <span class="px-2 py-1 rounded text-white text-sm ${servicio.status === "activo" ? "bg-green-500" : "bg-gray-500"}">${servicio.status}</span>
        </td>
        <td class="px-4 py-2 flex flex-wrap gap-2">
          <button class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm hover:bg-blue-200" data-id="${servicio.id}" data-action="editar">Editar</button>
          <button class="bg-${servicio.status === "activo" ? "red" : "green"}-100 text-${servicio.status === "activo" ? "red" : "green"}-800 px-2 py-1 rounded text-sm toggle-status" data-id="${servicio.id}">
            ${servicio.status === "activo" ? "Desactivar" : "Activar"}
          </button>
          <button class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm hover:bg-gray-200 eliminar-btn" data-id="${servicio.id}">Eliminar</button>
        </td>
      `;

      fila.querySelector(".toggle-status").addEventListener("click", () => {
        servicio.status = servicio.status === "activo" ? "inactivo" : "activo";
        renderizarServicios(inputBusqueda.value);
      });

      fila.querySelector("[data-action='editar']").addEventListener("click", () => {
        editId.value = servicio.id;
        formulario.name.value = servicio.name;
        formulario.description.value = servicio.description;
        formulario.duration.value = servicio.duration;
        formulario.price.value = servicio.price;
        formulario.category.value = servicio.category;
        dialogTitle.textContent = "Editar Servicio";
        dialogDescription.textContent = "Modifica los datos del servicio.";
        modal.classList.remove("hidden");
      });

      fila.querySelector(".eliminar-btn").addEventListener("click", () => {
        if (confirm("¿Estás seguro de que deseas eliminar este servicio?")) {
          const index = servicios.findIndex(s => s.id === servicio.id);
          if (index > -1) {
            servicios.splice(index, 1);
            renderizarServicios(inputBusqueda.value);
          }
        }
      });

      tabla.appendChild(fila);
    });
  }

  inputBusqueda.addEventListener("input", () => renderizarServicios(inputBusqueda.value));
  btnAbrir.addEventListener("click", () => {
    formulario.reset();
    editId.value = "";
    dialogTitle.textContent = "Agregar Servicio";
    dialogDescription.textContent = "Completa los campos para registrar un nuevo servicio.";
    modal.classList.remove("hidden");
  });
  btnCancelar.addEventListener("click", () => modal.classList.add("hidden"));

  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    spinner.classList.remove("hidden");

    const formData = new FormData(formulario);
    const id = formData.get("editId");
    const nombre = formData.get("name").trim();
    const esEdicion = id !== "";

    if (!esEdicion && servicios.some(s => s.name.toLowerCase() === nombre.toLowerCase())) {
      alert("Ya existe un servicio con ese nombre.");
      spinner.classList.add("hidden");
      return;
    }

    const nuevoServicio = {
      id: esEdicion ? id : (servicios.length + 1).toString(),
      name: nombre,
      description: formData.get("description"),
      duration: Number(formData.get("duration")),
      price: Number(formData.get("price")),
      category: formData.get("category"),
      status: esEdicion ? servicios.find(s => s.id === id).status : "activo"
    };

    if (esEdicion) {
      const index = servicios.findIndex(s => s.id === id);
      servicios[index] = nuevoServicio;
    } else {
      servicios.push(nuevoServicio);
    }

    renderizarServicios(inputBusqueda.value);
    modal.classList.add("hidden");
    formulario.reset();
    spinner.classList.add("hidden");
  });

  renderizarServicios();
}

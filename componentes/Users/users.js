function initComponent() {
  const usuarios = [
    { id: 1, nombre: "Dra. Sarah Johnson", correo: "sarah.johnson@vetclinic.com", rol: "veterinario", detalle: "Medicina General", estado: "activo", ultimaActividad: "2025-05-19T14:30:00" },
    { id: 2, nombre: "Dr. Michael Chen", correo: "michael.chen@vetclinic.com", rol: "veterinario", detalle: "Cirugía", estado: "activo", ultimaActividad: "2025-05-19T10:15:00" },
    { id: 3, nombre: "John Doe", correo: "john.doe@example.com", rol: "cliente", detalle: "Max (Perro), Bella (Gato)", estado: "activo", ultimaActividad: "2025-05-18T16:45:00" },
    { id: 4, nombre: "Sarah Smith", correo: "sarah.smith@example.com", rol: "cliente", detalle: "Rocky (Perro)", estado: "activo", ultimaActividad: "2025-05-17T09:20:00" },
    { id: 5, nombre: "Alex Rodriguez", correo: "alex.rodriguez@vetclinic.com", rol: "interno", detalle: "Supervisado por Dra. Sarah Johnson", estado: "activo", ultimaActividad: "2025-05-19T11:30:00" },
    { id: 6, nombre: "Jessica Taylor", correo: "jessica.taylor@vetclinic.com", rol: "interno", detalle: "Supervisado por Dr. Michael Chen", estado: "activo", ultimaActividad: "2025-05-19T13:10:00" },
    { id: 7, nombre: "Robert Wilson", correo: "robert.wilson@vetclinic.com", rol: "administrador", detalle: "—", estado: "activo", ultimaActividad: "2025-05-19T15:45:00" },
    { id: 8, nombre: "Emily Davis", correo: "emily.davis@example.com", rol: "cliente", detalle: "Luna (Gato)", estado: "inactivo", ultimaActividad: "2025-04-30T14:20:00" }
  ];

  let filtroRol = "all";

  const formatearFecha = (fechaStr) => {
    const fecha = new Date(fechaStr);
    const ahora = new Date();
    const horas = Math.floor((ahora - fecha) / 36e5);
    return horas < 24 ? `Hace ${horas} h` : fecha.toLocaleDateString();
  };

  const renderizarUsuarios = () => {
    const busqueda = document.getElementById('searchInput').value.toLowerCase();
    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';

    const filtrados = usuarios.filter(usuario =>
      (usuario.nombre.toLowerCase().includes(busqueda) || usuario.correo.toLowerCase().includes(busqueda)) &&
      (filtroRol === 'all' || usuario.rol === filtroRol)
    );

    if (filtrados.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="p-3 text-center text-gray-500">No se encontraron usuarios.</td></tr>`;
      return;
    }

    filtrados.forEach(usuario => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td class="p-3">${usuario.nombre}</td>
        <td class="p-3">${usuario.correo}</td>
        <td class="p-3 capitalize">${usuario.rol}</td>
        <td class="p-3">${usuario.detalle || '—'}</td>
        <td class="p-3">
          <span class="px-2 py-1 rounded text-white ${usuario.estado === 'activo' ? 'bg-green-500' : 'bg-gray-500'}">
            ${usuario.estado}
          </span>
        </td>
        <td class="p-3">${formatearFecha(usuario.ultimaActividad)}</td>
        <td class="p-3 space-x-2">
          <button class="btn-editar px-2 py-1 border rounded text-sm" data-id="${usuario.id}">Editar</button>
          <button class="btn-toggle px-2 py-1 border border-red-500 text-red-500 rounded text-sm" data-id="${usuario.id}">
            ${usuario.estado === 'activo' ? 'Desactivar' : 'Activar'}
          </button>
        </td>
      `;
      tbody.appendChild(fila);
    });

    document.querySelectorAll('.btn-editar').forEach(btn =>
      btn.addEventListener('click', () => abrirModalEdicion(+btn.dataset.id))
    );
    document.querySelectorAll('.btn-toggle').forEach(btn =>
      btn.addEventListener('click', () => cambiarEstado(+btn.dataset.id))
    );
  };

  const cambiarTab = (tab) => {
    filtroRol = tab;
    renderizarUsuarios();
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('bg-blue-100', btn.dataset.tab === tab);
      btn.classList.toggle('text-blue-600', btn.dataset.tab === tab);
    });
  };

  // Modal
  const modal = document.getElementById('userModal');
  const formulario = document.getElementById('userForm');
  const tituloModal = document.getElementById('modalTitle');

  const mostrarModal = () => modal.classList.remove('hidden');
  const ocultarModal = () => {
    formulario.reset();
    document.getElementById('editUserId').value = '';
    modal.classList.add('hidden');
  };

  const abrirModalEdicion = (id) => {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;
    tituloModal.textContent = "Editar Usuario";
    document.getElementById('editUserId').value = usuario.id;
    document.getElementById('userName').value = usuario.nombre;
    document.getElementById('userEmail').value = usuario.correo;
    document.getElementById('userRole').value = usuario.rol;
    mostrarModal();
  };

  const cambiarEstado = (id) => {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
      usuario.estado = usuario.estado === 'activo' ? 'inactivo' : 'activo';
      renderizarUsuarios();
    }
  };

  // Eventos
  document.getElementById('addUserBtn').addEventListener('click', () => {
    tituloModal.textContent = "Agregar Nuevo Usuario";
    formulario.reset();
    document.getElementById('editUserId').value = '';
    mostrarModal();
  });

  document.getElementById('cancelModal').addEventListener('click', ocultarModal);

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('editUserId').value;
    const nombre = document.getElementById('userName').value.trim();
    const correo = document.getElementById('userEmail').value.trim();
    const rol = document.getElementById('userRole').value;

    if (!nombre || !correo || !rol) return;

    if (id) {
      const usuario = usuarios.find(u => u.id == id);
      if (usuario) {
        usuario.nombre = nombre;
        usuario.correo = correo;
        usuario.rol = rol;
      }
    } else {
      usuarios.push({
        id: usuarios.length + 1,
        nombre,
        correo,
        rol,
        detalle: "—",
        estado: 'activo',
        ultimaActividad: new Date().toISOString()
      });
    }

    ocultarModal();
    renderizarUsuarios();
  });

  document.getElementById('searchInput').addEventListener('input', renderizarUsuarios);
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => cambiarTab(btn.dataset.tab));
  });

  renderizarUsuarios();
}

initComponent();

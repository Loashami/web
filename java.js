// routes.js u "java.js" — Router + loader general actualizado

const currentPath = window.location.pathname;

const routes = [
  { name: "Dashboard", href: "#/admin/dashboard", file: "Dashboard/dashboard.html", script: "Dashboard/dashboard.js", icon: "layout-dashboard" },
  { name: "Users", href: "#/admin/users", file: "Users/users.html", script: "Users/users.js", icon: "users" },
  { name: "Services", href: "#/admin/services", file: "Services/services.html", script: "Services/services.js", icon: "settings" },
  { name: "Appointments", href: "#/admin/appointments", file: "Appointments/appointments.html", script: "Appointments/appointments.js", icon: "calendar" },
  { name: "Complaints", href: "#/admin/complaints", file: "Complaints/complaints.html", script: "Complaints/complaints.js", icon: "book-open" },
  { name: "Reports", href: "#/admin/reports", file: "Reports/reports.html", script: "Reports/reports.js", icon: "file-text" },
  { name: "Payments", href: "#/admin/payments", file: "Payments/payments.html", script: "Payments/payments.js", icon: "dollar-sign" },
  { name: "Inventory", href: "#/admin/inventory", file: "Inventory/inventory.html", script: "Inventory/inventory.js", icon: "package" },
];

const sidebar = document.getElementById("sidebar-links");
const main = document.getElementById("main-content");

routes.forEach(route => {
  const link = document.createElement("a");
  link.href = route.href;
  link.className = `flex items-center gap-3 px-4 py-2 rounded text-sm font-medium hover:bg-gray-100 ${
    currentPath === route.href ? 'bg-gray-100 text-gray-900' : 'text-gray-600'
  }`;
  link.innerHTML = `<i data-lucide="${route.icon}" class="w-4 h-4"></i>${route.name}`;

  link.addEventListener("click", (e) => {
    e.preventDefault();
    loadComponent(route.file, route.script);
    setActiveLink(link);
    history.pushState({}, '', route.href);
  });

  sidebar.appendChild(link);
});

function loadComponent(file, scriptFile) {
  fetch(`./componentes/${file}`)
    .then(res => {
      if (!res.ok) throw new Error("Error al cargar componente");
      return res.text();
    })
    .then(html => {
      main.innerHTML = html;
      lucide.createIcons();
      if (scriptFile) loadScript(`./componentes/${scriptFile}`);
    })
    .catch(() => {
      main.innerHTML = `<div class="p-4 bg-red-100 text-red-800 rounded">No se pudo cargar el componente <strong>${file}</strong>.</div>`;
    });
}

function setActiveLink(activeElement) {
  document.querySelectorAll("#sidebar-links a").forEach(link => {
    link.classList.remove("bg-gray-100", "text-gray-900");
    link.classList.add("text-gray-600");
  });
  activeElement.classList.add("bg-gray-100", "text-gray-900");
  activeElement.classList.remove("text-gray-600");
}

function loadScript(scriptUrl) {
  const oldScript = document.querySelector("#dynamic-script");
  if (oldScript) oldScript.remove();

  const script = document.createElement("script");
  script.src = scriptUrl;
  script.id = "dynamic-script";
  document.body.appendChild(script);
}

lucide.createIcons();

window.addEventListener("DOMContentLoaded", () => {
  const match = routes.find(r => r.href === location.hash);
  if (match) {
    loadComponent(match.file, match.script);
  }
});

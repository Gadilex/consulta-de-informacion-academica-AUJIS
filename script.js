let horariosData = [];
let repositorioData = [];
let isAdmin = false;

// Cargar datos desde JSON
async function loadInitialData() {
  try {
    const resHorarios = await fetch("horarios.json");
    horariosData = await resHorarios.json();

    const resRepo = await fetch("repositorio.json");
    repositorioData = await resRepo.json();

    renderHorarios(horariosData);
    renderRepositorio(repositorioData);
  } catch (error) {
    console.error("Error al cargar archivos JSON:", error);
  }
}

// Renderizar tabla de horarios
function renderHorarios(data) {
  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding: 20px;">No se encontraron registros.</td></tr>`;
    return;
  }

  data.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td><strong>${item.materia}</strong></td>
      <td>${item.docente}</td>
      <td><span class="badge">${item.trayecto}</span></td>
      <td>${item.horario}</td>
      <td>${item.aula}</td>
    `;
    tableBody.appendChild(row);
  });
}

// Renderizar repositorio
function renderRepositorio(data) {
  const repoGrid = document.getElementById("repoGrid");
  repoGrid.innerHTML = "";

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "repo-card";
    card.innerHTML = `
      <div class="repo-icon"><i data-lucide="file-text"></i></div>
      <div class="repo-info">
        <h4>${item.titulo}</h4>
        <p><small>${item.categoria} • ${item.fecha}</small></p>
      </div>
      <button class="btn-download" onclick="downloadPDF('${item.titulo}', '${item.contenido}')">
        <i data-lucide="download"></i> Descargar ${item.formato}
      </button>
    `;
    repoGrid.appendChild(card);
  });
  lucide.createIcons();
}

// SOLUCIÓN AL CONGELAMIENTO: Generador y Descargador seguro de PDF/Texto mediante BLOB
function downloadPDF(filename, textContent) {
  const blob = new Blob(
    [
      `ALDEA UNIVERSITARIA JOSE ISIDRO SILVA\nDOCUMENTO OFICIAL\n\n${filename}\n\n${textContent}`,
    ],
    { type: "text/plain;charset=utf-8" }
  );
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename.replace(/\s+/g, "_")}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Filtrar horarios
function filterData() {
  const searchValue = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const trayectoValue = document.getElementById("trayectoSelect").value;

  const filtered = horariosData.filter((item) => {
    const matchesSearch =
      item.materia.toLowerCase().includes(searchValue) ||
      item.docente.toLowerCase().includes(searchValue) ||
      item.aula.toLowerCase().includes(searchValue);
    const matchesTrayecto =
      trayectoValue === "todos" || item.trayecto === trayectoValue;
    return matchesSearch && matchesTrayecto;
  });

  renderHorarios(filtered);
}

// Cambiar pestañas
function switchTab(tabName) {
  document
    .querySelectorAll(".tab-content")
    .forEach((el) => el.classList.remove("active"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((el) => el.classList.remove("active"));

  if (tabName === "horarios") {
    document.getElementById("tab-horarios").classList.add("active");
  } else {
    document.getElementById("tab-repositorio").classList.add("active");
  }
  event.currentTarget.classList.add("active");
  lucide.createIcons();
}

// Modales y Autenticación Admin
function toggleAuthModal() {
  const modal = document.getElementById("loginModal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function handleLogin(e) {
  e.preventDefault();
  const user = document.getElementById("adminUser").value;
  const pass = document.getElementById("adminPass").value;

  if (user === "admin" && pass === "1234") {
    isAdmin = true;
    document.getElementById("adminBanner").style.display = "flex";
    document.getElementById("addHorarioBtn").style.display = "inline-flex";
    document.getElementById("authBtn").style.display = "none";
    toggleAuthModal();
    alert("¡Sesión de Administración Iniciada!");
  } else {
    alert("Usuario o contraseña incorrectos.");
  }
}

function logoutAdmin() {
  isAdmin = false;
  document.getElementById("adminBanner").style.display = "none";
  document.getElementById("addHorarioBtn").style.display = "none";
  document.getElementById("authBtn").style.display = "inline-flex";
}

function openAddModal() {
  document.getElementById("addModal").style.display = "flex";
}

function closeAddModal() {
  document.getElementById("addModal").style.display = "none";
}

function handleAddHorario(e) {
  e.preventDefault();
  const newItem = {
    id: horariosData.length + 1,
    materia: document.getElementById("newMateria").value,
    docente: document.getElementById("newDocente").value,
    trayecto: document.getElementById("newTrayecto").value,
    horario: document.getElementById("newHorario").value,
    aula: document.getElementById("newAula").value,
  };

  horariosData.push(newItem);
  renderHorarios(horariosData);
  closeAddModal();
  e.target.reset();
}

// Inicializar
document.addEventListener("DOMContentLoaded", () => {
  loadInitialData();
});

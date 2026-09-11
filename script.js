let horariosData = [];
let repositorioData = [];

// Cargar Datos con fallback a LocalStorage
async function initPortal() {
  const savedHorarios = localStorage.getItem("aldea_horarios");
  const savedRepo = localStorage.getItem("aldea_repo");

  if (savedHorarios) {
    horariosData = JSON.parse(savedHorarios);
  } else {
    const res = await fetch("horarios.json");
    horariosData = await res.json();
    localStorage.setItem("aldea_horarios", JSON.stringify(horariosData));
  }

  if (savedRepo) {
    repositorioData = JSON.parse(savedRepo);
  } else {
    const resRepo = await fetch("repositorio.json");
    repositorioData = await resRepo.json();
    localStorage.setItem("aldea_repo", JSON.stringify(repositorioData));
  }

  renderHorarios(horariosData);
  renderRepositorio(repositorioData);
  loadInstagramFeed();
  updateStats();
}

function updateStats() {
  document.getElementById("statMaterias").innerText = horariosData.length;
  const docentesUnicos = new Set(horariosData.map((h) => h.docente)).size;
  document.getElementById("statDocentes").innerText = docentesUnicos;
  document.getElementById("statDocs").innerText = repositorioData.length;
}

function renderHorarios(data) {
  const tbody = document.getElementById("tableBody");
  tbody.innerHTML = "";

  data.forEach((item) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${item.materia}</strong></td>
      <td>${item.docente}</td>
      <td><span class="hero-badge">${item.trayecto}</span></td>
      <td>${item.horario}</td>
      <td>${item.aula}</td>
    `;
    tbody.appendChild(tr);
  });
}

function renderRepositorio(data) {
  const grid = document.getElementById("repoGrid");
  grid.innerHTML = "";

  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = "repo-item";
    card.innerHTML = `
      <div>
        <h4>${item.titulo}</h4>
        <p><small>${item.categoria} • ${item.fecha || "2026"}</small></p>
      </div>
      <button class="btn-primary" onclick="downloadDoc('${item.titulo}', '${
      item.contenido
    }')">
        <i data-lucide="download"></i> Descargar Documento
      </button>
    `;
    grid.appendChild(card);
  });
  lucide.createIcons();
}

function downloadDoc(title, content) {
  const blob = new Blob(
    [`DOCUMENTO OFICIAL - ALDEA JOSE ISIDRO SILVA\n\n${title}\n\n${content}`],
    { type: "text/plain;charset=utf-8" }
  );
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${title.replace(/\s+/g, "_")}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

function filterData() {
  const search = document.getElementById("searchInput").value.toLowerCase();
  const trayecto = document.getElementById("trayectoSelect").value;

  const filtered = horariosData.filter((item) => {
    const matchSearch =
      item.materia.toLowerCase().includes(search) ||
      item.docente.toLowerCase().includes(search);
    const matchTrayecto = trayecto === "todos" || item.trayecto === trayecto;
    return matchSearch && matchTrayecto;
  });

  renderHorarios(filtered);
}

function switchTab(tab) {
  document
    .querySelectorAll(".tab-content")
    .forEach((el) => el.classList.remove("active"));
  document
    .querySelectorAll(".tab-btn")
    .forEach((el) => el.classList.remove("active"));

  if (tab === "horarios") {
    document.getElementById("tab-horarios").classList.add("active");
    document.getElementById("tabBtnHorarios").classList.add("active");
  } else {
    document.getElementById("tab-repositorio").classList.add("active");
    document.getElementById("tabBtnRepo").classList.add("active");
  }
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

/*function loadInstagramFeed() {
  const config = JSON.parse(
    localStorage.getItem("aldea_insta_config") ||
      '{"enabled": false, "username": ""}'
  );
  const feedSection = document.getElementById("instagram-feed-section");
  const iframe = document.getElementById("instaIframe");
  const link = document.getElementById("instaLink");

  if (config.enabled && config.username) {
    feedSection.style.display = "block";
    link.href = `https://www.instagram.com/${config.username}/`;

    // Generación de la vista previa usando widget/embed estático
    iframe.src = `https://www.instagram.com/${config.username}/embed`;
  } else {
    feedSection.style.display = "none";
  }
}*/

async function loadInstagramFeed() {
  const feedSection = document.getElementById('instagram-feed-section');
  const iframe = document.getElementById('instaIframe');
  const link = document.getElementById('instaLink');

  if (!feedSection) return;

  try {
    // Lee la configuración desde el archivo del proyecto
    const res = await fetch('./config.json');
    const config = await res.json();

    if (config.instagram && config.instagram.enabled && config.instagram.username) {
      feedSection.style.display = 'block';
      link.href = `https://www.instagram.com/${config.instagram.username}/`;
      iframe.src = `https://www.instagram.com/${config.instagram.username}/embed`;
    } else {
      feedSection.style.display = 'none';
    }
  } catch (error) {
    console.error('Error al cargar config.json:', error);
    feedSection.style.display = 'none';
  }
}


document.addEventListener("DOMContentLoaded", () => {
  loadInstagramFeed();
  initPortal();
  lucide.createIcons();
});

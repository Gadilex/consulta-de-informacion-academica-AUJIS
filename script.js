let globalHorarios = [];

// 1. CARGA INICIAL (ANTI-CACHÉ)
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  
  loadHorarios();
  loadRepositorio();
  loadInstagramConfig();
});

// 2. CAMBIO DE PESTAÑAS (TABS)
function switchTab(tabName) {
  const tabHorarios = document.getElementById('tab-horarios');
  const tabRepo = document.getElementById('tab-repositorio');
  const btnHorarios = document.getElementById('tabBtnHorarios');
  const btnRepo = document.getElementById('tabBtnRepo');

  if (tabName === 'horarios') {
    tabHorarios.classList.add('active');
    tabRepo.classList.remove('active');
    if (btnHorarios) btnHorarios.classList.add('active');
    if (btnRepo) btnRepo.classList.remove('active');
  } else if (tabName === 'repositorio') {
    tabRepo.classList.add('active');
    tabHorarios.classList.remove('active');
    if (btnRepo) btnRepo.classList.add('active');
    if (btnHorarios) btnHorarios.classList.remove('active');
  }

  // Desplazamiento suave al contenedor de pestañas
  const tabsNav = document.querySelector('.tabs-nav');
  if (tabsNav) {
    tabsNav.scrollIntoView({ behavior: 'smooth' });
  }
}

// 3. CARGAR Y RENDERIZAR HORARIOS
async function loadHorarios() {
  const tbody = document.getElementById('tableBody');
  if (!tbody) return;

  try {
    // Parámetro ?t=Date.now() obliga al navegador a pedir el JSON fresco a GitHub/Vercel
    const res = await fetch('./horarios.json?t=' + Date.now());
    globalHorarios = res.ok ? await res.json() : [];

    // Actualizar métricas
    const materiasCount = globalHorarios.length;
    const docentesUnicos = new Set(globalHorarios.map(h => h.docente)).size;
    
    document.getElementById('statMaterias').innerText = materiasCount;
    document.getElementById('statDocentes').innerText = docentesUnicos;

    renderHorariosTable(globalHorarios);
  } catch (error) {
    console.error('Error al cargar horarios:', error);
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;">Error al cargar la tabla de horarios.</td></tr>';
  }
}

function renderHorariosTable(data) {
  const tbody = document.getElementById('tableBody');
  if (!tbody) return;

  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:1.5rem; color:#94a3b8;">No se encontraron registros de horarios.</td></tr>';
    return;
  }

  tbody.innerHTML = data.map(item => `
    <tr>
      <td><strong>${item.unidad}</strong></td>
      <td>${item.docente}</td>
      <td><span class="hero-badge" style="font-size:0.75rem;">${item.trayecto}</span></td>
      <td>${item.horario}</td>
      <td>${item.aula}</td>
    </tr>
  `).join('');
}

// FILTRADO DE BUSQUEDA EN TIEMPO REAL
function filterData() {
  const search = document.getElementById('searchInput').value.toLowerCase();
  const trayecto = document.getElementById('trayectoSelect').value;

  const filtered = globalHorarios.filter(item => {
    const matchSearch = item.unidad.toLowerCase().includes(search) ||
                        item.docente.toLowerCase().includes(search) ||
                        item.aula.toLowerCase().includes(search);
    const matchTrayecto = trayecto === 'todos' || item.trayecto === trayecto;

    return matchSearch && matchTrayecto;
  });

  renderHorariosTable(filtered);
}

// 4. CARGAR Y RENDERIZAR REPOSISTORIO DIGITAL (CON BOTÓN DE DESCARGA DIRECTA)
async function loadRepositorio() {
  const repoGrid = document.getElementById('repoGrid');
  if (!repoGrid) return;

  try {
    // Petición anti-caché
    const res = await fetch('./repositorio.json?t=' + Date.now());
    const docs = res.ok ? await res.json() : [];

    document.getElementById('statDocs').innerText = docs.length;

    if (docs.length === 0) {
      repoGrid.innerHTML = '<p style="color:#94a3b8; grid-column: 1/-1;">No hay documentos disponibles en este momento.</p>';
      return;
    }

    repoGrid.innerHTML = docs.map(doc => `
      <div class="card-box doc-card" style="display: flex; flex-direction: column; justify-content: space-between; gap: 1rem; margin-bottom: 0;">
        <div>
          <span class="hero-badge" style="font-size: 0.75rem;">${doc.categoria || 'Oficial'}</span>
          <h4 style="margin: 0.6rem 0 0.3rem 0; font-size: 1.1rem; color: #f8fafc;">${doc.titulo}</h4>
          <p style="font-size: 0.88rem; color: #94a3b8; line-height: 1.4; margin: 0;">${doc.contenido}</p>
        </div>
        <div style="margin-top: 0.5rem;">
          <a href="${doc.url || '#'}" target="_blank" rel="noopener noreferrer" class="btn-primary full-width" style="text-decoration: none; display: flex; align-items: center; justify-content: center; gap: 0.5rem; text-align: center;">
            <i data-lucide="download"></i> Descargar Documento
          </a>
        </div>
      </div>
    `).join('');

    if (window.lucide) lucide.createIcons();
  } catch (error) {
    console.error('Error al cargar repositorio:', error);
    repoGrid.innerHTML = '<p style="color:#94a3b8; grid-column: 1/-1;">Error al cargar los documentos oficiales.</p>';
  }
}

// 5. CARGAR CONFIGURACIÓN DE INSTAGRAM
async function loadInstagramConfig() {
  const section = document.getElementById('instagram-feed-section');
  if (!section) return;

  try {
    const res = await fetch('./config.json?t=' + Date.now());
    if (res.ok) {
      const config = await res.json();
      if (config.instagram && config.instagram.enabled && config.instagram.username) {
        const username = config.instagram.username;
        document.getElementById('instaLink').href = `https://instagram.com/${username}`;
        document.getElementById('instaIframe').src = `https://www.instagram.com/${username}/embed`;
        section.style.display = 'block';
      } else {
        section.style.display = 'none';
      }
    }
  } catch (error) {
    section.style.display = 'none';
  }
}
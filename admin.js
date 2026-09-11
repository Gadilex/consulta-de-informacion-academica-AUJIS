const GITHUB_OWNER = 'Gadilex';  
const GITHUB_REPO = 'consulta-de-informacion-academica-AUJIS';      
const GITHUB_BRANCH = 'main';

let currentHorarios = [];
let currentDocs = [];

// 1. SISTEMA DE AUTENTICACIÓN
function handleAdminLogin(e) {
  if (e) e.preventDefault();
  
  const user = document.getElementById('adminUser').value.trim();
  const pass = document.getElementById('adminPass').value.trim();

  if (user === 'admin' && pass === 'aldea2026') {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    sessionStorage.setItem('aldea_logged', 'true');
    
    if (window.lucide) lucide.createIcons();
    
    loadAdminConfig();
    loadDashboardLists();
  } else {
    alert('Usuario o contraseña incorrectos.');
  }
}

function logoutAdmin() {
  sessionStorage.removeItem('aldea_logged');
  document.getElementById('adminDashboard').style.display = 'none';
  document.getElementById('loginBox').style.display = 'block';
}

// 2. CONEXIÓN CON GITHUB API
function getGitHubToken() {
  let token = localStorage.getItem('gh_admin_token');
  if (!token) {
    token = prompt('Introduce tu Personal Access Token de GitHub para publicar cambios en Vercel:');
    if (token) {
      token = token.trim();
      localStorage.setItem('gh_admin_token', token);
    }
  }
  return token;
}

async function saveToJsonInGitHub(filePath, newJsonObject, commitMessage) {
  const token = getGitHubToken();
  if (!token) {
    alert('⚠️ Se requiere el Token de GitHub para actualizar la web.');
    return false;
  }

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

  try {
    const getRes = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    });

    let sha = '';
    if (getRes.ok) {
      const fileData = await getRes.json();
      sha = fileData.sha;
    }

    const jsonString = JSON.stringify(newJsonObject, null, 2);
    const contentBase64 = btoa(unescape(encodeURIComponent(jsonString)));

    const putRes = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify({
        message: commitMessage,
        content: contentBase64,
        sha: sha,
        branch: GITHUB_BRANCH
      })
    });

    if (putRes.ok) {
      alert('✅ ¡Cambios guardados con éxito! En unos segundos Vercel actualizará la página.');
      loadDashboardLists();
      return true;
    } else {
      const errorData = await putRes.json();
      if (putRes.status === 401) {
        alert('❌ Token de GitHub inválido.');
        localStorage.removeItem('gh_admin_token');
      } else {
        alert(`❌ Error al guardar en GitHub: ${errorData.message}`);
      }
      return false;
    }
  } catch (error) {
    console.error('Error de red:', error);
    alert('❌ Ocurrió un error al conectar con GitHub.');
    return false;
  }
}

// 3. GESTIÓN DE HORARIOS (CREAR / EDITAR / ELIMINAR)
async function saveNewHorario(e) {
  if (e) e.preventDefault();
  
  const editId = document.getElementById('editHorarioId').value;
  const unidad = document.getElementById('addMateria').value.trim();
  const docente = document.getElementById('addDocente').value.trim();
  const trayecto = document.getElementById('addTrayecto').value;
  const diaHorario = document.getElementById('addHorario').value.trim();
  const aula = document.getElementById('addAula').value.trim();

  if (editId) {
    // Modo Edición
    const index = currentHorarios.findIndex(h => h.id.toString() === editId.toString());
    if (index !== -1) {
      currentHorarios[index] = { id: editId, unidad, docente, trayecto, horario: diaHorario, aula };
    }
  } else {
    // Modo Nuevo
    currentHorarios.push({
      id: Date.now().toString(),
      unidad, docente, trayecto, horario: diaHorario, aula
    });
  }

  const ok = await saveToJsonInGitHub('horarios.json', currentHorarios, `Actualizar horario: ${unidad}`);
  if (ok) cancelEditHorario();
}

function startEditHorario(id) {
  const item = currentHorarios.find(h => h.id.toString() === id.toString());
  if (!item) return;

  document.getElementById('editHorarioId').value = item.id;
  document.getElementById('addMateria').value = item.unidad;
  document.getElementById('addDocente').value = item.docente;
  document.getElementById('addTrayecto').value = item.trayecto;
  document.getElementById('addHorario').value = item.horario;
  document.getElementById('addAula').value = item.aula;

  document.getElementById('horarioFormTitle').innerHTML = '<i data-lucide="edit"></i> Editar Horario';
  document.getElementById('btnSaveHorario').innerText = 'Actualizar Horario';
  document.getElementById('btnCancelHorario').style.display = 'block';
  if (window.lucide) lucide.createIcons();
}

function cancelEditHorario() {
  document.getElementById('editHorarioId').value = '';
  document.getElementById('horarioForm').reset();
  document.getElementById('horarioFormTitle').innerHTML = '<i data-lucide="plus-circle"></i> Registrar Horario / Docente';
  document.getElementById('btnSaveHorario').innerText = 'Guardar Horario';
  document.getElementById('btnCancelHorario').style.display = 'none';
  if (window.lucide) lucide.createIcons();
}

async function deleteHorario(id) {
  if (!confirm('¿Estás seguro de eliminar este horario?')) return;
  currentHorarios = currentHorarios.filter(h => h.id.toString() !== id.toString());
  await saveToJsonInGitHub('horarios.json', currentHorarios, 'Eliminar horario');
}

// 4. GESTIÓN DE DOCUMENTOS (CREAR / EDITAR / ELIMINAR)
async function saveNewDoc(e) {
  if (e) e.preventDefault();

  const editId = document.getElementById('editDocId').value;
  const titulo = document.getElementById('addDocTitulo').value.trim();
  const categoria = document.getElementById('addDocCat').value.trim();
  const contenido = document.getElementById('addDocContenido').value.trim();

  if (editId) {
    const index = currentDocs.findIndex(d => d.id.toString() === editId.toString());
    if (index !== -1) {
      currentDocs[index] = { ...currentDocs[index], titulo, categoria, contenido };
    }
  } else {
    currentDocs.push({
      id: Date.now().toString(),
      titulo, categoria, contenido,
      fecha: new Date().toISOString().split('T')[0]
    });
  }

  const ok = await saveToJsonInGitHub('repositorio.json', currentDocs, `Actualizar documento: ${titulo}`);
  if (ok) cancelEditDoc();
}

function startEditDoc(id) {
  const item = currentDocs.find(d => d.id.toString() === id.toString());
  if (!item) return;

  document.getElementById('editDocId').value = item.id;
  document.getElementById('addDocTitulo').value = item.titulo;
  document.getElementById('addDocCat').value = item.categoria;
  document.getElementById('addDocContenido').value = item.contenido;

  document.getElementById('docFormTitle').innerHTML = '<i data-lucide="edit"></i> Editar Documento';
  document.getElementById('btnSaveDoc').innerText = 'Actualizar Documento';
  document.getElementById('btnCancelDoc').style.display = 'block';
  if (window.lucide) lucide.createIcons();
}

function cancelEditDoc() {
  document.getElementById('editDocId').value = '';
  document.getElementById('docForm').reset();
  document.getElementById('docFormTitle').innerHTML = '<i data-lucide="file-plus"></i> Registrar Documento Oficial';
  document.getElementById('btnSaveDoc').innerText = 'Guardar Documento';
  document.getElementById('btnCancelDoc').style.display = 'none';
  if (window.lucide) lucide.createIcons();
}

async function deleteDoc(id) {
  if (!confirm('¿Estás seguro de eliminar este documento?')) return;
  currentDocs = currentDocs.filter(d => d.id.toString() !== id.toString());
  await saveToJsonInGitHub('repositorio.json', currentDocs, 'Eliminar documento');
}

// 5. RENDERIZAR LISTAS EN EL PANEL
async function loadDashboardLists() {
  // Cargar Horarios
  try {
    const resH = await fetch('./horarios.json?cache=' + Date.now());
    currentHorarios = resH.ok ? await resH.json() : [];
    const hContainer = document.getElementById('horariosList');
    
    if (currentHorarios.length === 0) {
      hContainer.innerHTML = '<p style="color:#94a3b8; font-size:0.85rem;">No hay horarios cargados.</p>';
    } else {
      hContainer.innerHTML = currentHorarios.map(h => `
        <div class="admin-item-row">
          <div>
            <strong>${h.unidad}</strong> <small>(${h.trayecto})</small><br>
            <span style="font-size:0.8rem; color:#94a3b8;">${h.docente} | ${h.horario}</span>
          </div>
          <div class="admin-item-actions">
            <button type="button" onclick="startEditHorario('${h.id}')" class="btn-sm btn-edit">Editar</button>
            <button type="button" onclick="deleteHorario('${h.id}')" class="btn-sm btn-delete">Eliminar</button>
          </div>
        </div>
      `).join('');
    }
  } catch (err) { console.error(err); }

  // Cargar Documentos
  try {
    const resD = await fetch('./repositorio.json?cache=' + Date.now());
    currentDocs = resD.ok ? await resD.json() : [];
    const dContainer = document.getElementById('docsList');

    if (currentDocs.length === 0) {
      dContainer.innerHTML = '<p style="color:#94a3b8; font-size:0.85rem;">No hay documentos cargados.</p>';
    } else {
      dContainer.innerHTML = currentDocs.map(d => `
        <div class="admin-item-row">
          <div>
            <strong>${d.titulo}</strong> <small>(${d.categoria})</small>
          </div>
          <div class="admin-item-actions">
            <button type="button" onclick="startEditDoc('${d.id}')" class="btn-sm btn-edit">Editar</button>
            <button type="button" onclick="deleteDoc('${d.id}')" class="btn-sm btn-delete">Eliminar</button>
          </div>
        </div>
      `).join('');
    }
  } catch (err) { console.error(err); }
}

async function saveInstaConfig(e) {
  if (e) e.preventDefault();
  const enabled = document.getElementById('instaToggle').checked;
  const username = document.getElementById('instaUsername').value.trim().replace('@', '');

  await saveToJsonInGitHub('config.json', { instagram: { enabled, username } }, 'Actualizar Instagram');
}

async function loadAdminConfig() {
  try {
    const res = await fetch('./config.json?cache=' + Date.now());
    if (res.ok) {
      const config = await res.json();
      if (config.instagram) {
        document.getElementById('instaToggle').checked = config.instagram.enabled;
        document.getElementById('instaUsername').value = config.instagram.username || '';
      }
    }
  } catch (err) {}
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  if (sessionStorage.getItem('aldea_logged') === 'true') {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadAdminConfig();
    loadDashboardLists();
  }
});
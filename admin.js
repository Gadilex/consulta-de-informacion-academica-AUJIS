/*function handleAdminLogin(e) {
  e.preventDefault();
  const user = document.getElementById("adminUser").value;
  const pass = document.getElementById("adminPass").value;

  if (user === "glend4" && pass === "adminInicio26") {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("adminDashboard").style.display = "block";
    document.body.classList.remove("admin-body");
  } else {
    alert("Credenciales incorrectas");
  }
  lucide.createIcons();
}

function logoutAdmin() {
  window.location.href = "index.html";
}

function saveNewHorario(e) {
  e.preventDefault();
  const newItem = {
    id: Date.now(),
    materia: document.getElementById("addMateria").value,
    docente: document.getElementById("addDocente").value,
    trayecto: document.getElementById("addTrayecto").value,
    horario: document.getElementById("addHorario").value,
    aula: document.getElementById("addAula").value,
  };

  let saved = JSON.parse(localStorage.getItem("aldea_horarios") || "[]");
  saved.push(newItem);
  localStorage.setItem("aldea_horarios", JSON.stringify(saved));

  alert("¡Registro académico guardado exitosamente!");
  e.target.reset();
}

function saveNewDoc(e) {
  e.preventDefault();
  const newDoc = {
    id: Date.now(),
    titulo: document.getElementById("addDocTitulo").value,
    categoria: document.getElementById("addDocCat").value,
    contenido: document.getElementById("addDocContenido").value,
    fecha: "2026",
  };

  let saved = JSON.parse(localStorage.getItem("aldea_repo") || "[]");
  saved.push(newDoc);
  localStorage.setItem("aldea_repo", JSON.stringify(saved));

  alert("¡Documento guardado exitosamente!");
  e.target.reset();
}

// Cargar estado actual al abrir la interfaz
function loadAdminInstaConfig() {
  const config = JSON.parse(
    localStorage.getItem("aldea_insta_config") ||
      '{"enabled": false, "username": ""}'
  );
  document.getElementById("instaToggle").checked = config.enabled;
  document.getElementById("instaUsername").value = config.username || "";
}

// Guardar cambios del Toggle e Instagram
function saveInstaConfig(e) {
  e.preventDefault();
  const config = {
    enabled: document.getElementById("instaToggle").checked,
    username: document
      .getElementById("instaUsername")
      .value.trim()
      .replace("@", ""),
  };

  localStorage.setItem("aldea_insta_config", JSON.stringify(config));
  alert("¡Configuración del Feed de Instagram actualizada!");
}

// Cargar la configuración actual en el panel admin al entrar
async function loadAdminConfig() {
  try {
    const res = await fetch('./config.json');
    const config = await res.json();

    const toggle = document.getElementById('instaToggle');
    const userInput = document.getElementById('instaUsername');

    if (toggle && userInput && config.instagram) {
      toggle.checked = config.instagram.enabled;
      userInput.value = config.instagram.username || '';
    }
  } catch (err) {
    console.error('Error al cargar la configuración en admin:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadAdminConfig);

document.addEventListener("DOMContentLoaded", () => {
  lucide.createIcons();
});*/
/*
// MANTÉN TU LOGIN ACTUAL
function handleLogin(e) {
  if (e) e.preventDefault();
  const user = document.getElementById('adminUser').value;
  const pass = document.getElementById('adminPass').value;

  if (user === 'admin' && pass === 'aldea2026') {
    document.getElementById('loginCard').style.display = 'none';
    document.getElementById('adminPanel').style.display = 'block';
    sessionStorage.setItem('aldea_logged', 'true');
    loadAdminConfig(); // Carga la configuración al entrar
  } else {
    alert('Usuario o contraseña incorrectos');
  }
}

// DATOS DE TU REPOSITORIO DE GITHUB
const GITHUB_OWNER = 'Gadilex';  
const GITHUB_REPO = 'consulta-de-informacion-academica-AUJIS';      
const GITHUB_BRANCH = 'main';

// Solicitar token de GitHub al guardar
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

// Función central para actualizar archivos .json
async function saveToJsonInGitHub(filePath, newJsonObject, commitMessage) {
  const token = getGitHubToken();
  if (!token) {
    alert('⚠️ Se requiere el Token de GitHub para actualizar la web.');
    return false;
  }

  const url = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filePath}`;

  try {
    // Obtener SHA actual del archivo
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

    // Convertir JSON a Base64 Unicode
    const jsonString = JSON.stringify(newJsonObject, null, 2);
    const contentBase64 = btoa(unescape(encodeURIComponent(jsonString)));

    // Subir cambio a GitHub
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
      alert('✅ ¡Cambios guardados con éxito! En unos 15 a 20 segundos Vercel actualizará la página para todos.');
      return true;
    } else {
      const errorData = await putRes.json();
      if (putRes.status === 401) {
        alert('❌ Token de GitHub inválido. Intenta de nuevo.');
        localStorage.removeItem('gh_admin_token');
      } else {
        alert(`❌ Error al guardar en GitHub: ${errorData.message}`);
      }
      return false;
    }
  } catch (error) {
    console.error('Error de red:', error);
    alert('❌ Ocurrió un error al intentar conectarse con GitHub.');
    return false;
  }
}

// 1. Guardar Configuración del Feed de Instagram
async function saveInstaConfig(e) {
  if (e) e.preventDefault();
  const enabled = document.getElementById('instaToggle').checked;
  const username = document.getElementById('instaUsername').value.trim().replace('@', '');

  const updatedConfig = {
    instagram: {
      enabled: enabled,
      username: username
    }
  };

  await saveToJsonInGitHub(
    'config.json',
    updatedConfig,
    `Actualización Feed Instagram: ${enabled ? 'Activado' : 'Desactivado'}`
  );
}

// 2. Guardar Nuevo Horario / Docente
async function saveHorario(e) {
  if (e) e.preventDefault();
  const unidad = document.getElementById('horarioUnidad').value.trim();
  const docente = document.getElementById('horarioDocente').value.trim();
  const trayecto = document.getElementById('horarioTrayecto').value;
  const diaHorario = document.getElementById('horarioDia').value.trim();
  const aula = document.getElementById('horarioAula').value.trim();

  try {
    const res = await fetch('./horarios.json');
    const horarios = res.ok ? await res.json() : [];

    const nuevoHorario = {
      id: Date.now().toString(),
      unidad,
      docente,
      trayecto,
      horario: diaHorario,
      aula
    };

    horarios.push(nuevoHorario);

    const ok = await saveToJsonInGitHub(
      'horarios.json',
      horarios,
      `Agregar nuevo horario: ${unidad}`
    );

    if (ok && e && e.target) e.target.reset();
  } catch (err) {
    alert('Error al leer horarios.json');
  }
}

// Cargar estado inicial del toggle en el panel al estar logueado
async function loadAdminConfig() {
  try {
    const res = await fetch('./config.json');
    if (res.ok) {
      const config = await res.json();
      const toggle = document.getElementById('instaToggle');
      const userInput = document.getElementById('instaUsername');

      if (toggle && userInput && config.instagram) {
        toggle.checked = config.instagram.enabled;
        userInput.value = config.instagram.username || '';
      }
    }
  } catch (err) {
    console.error('Error al cargar config.json:', err);
  }
}

// Vincular el evento Submit del login apenas cargue el documento
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('#loginCard form') || document.querySelector('form');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }

  // Verificar si ya había una sesión activa en la pestaña actual
  if (sessionStorage.getItem('aldea_logged') === 'true') {
    const loginCard = document.getElementById('loginCard');
    const adminPanel = document.getElementById('adminPanel');
    if (loginCard && adminPanel) {
      loginCard.style.display = 'none';
      adminPanel.style.display = 'block';
      loadAdminConfig();
    }
  }
});*/

// ==========================================
// CONFIGURACIÓN DE TU REPOSITORIO GITHUB
// ==========================================
const GITHUB_OWNER = 'Gadilex';  
const GITHUB_REPO = 'consulta-de-informacion-academica-AUJIS';      
const GITHUB_BRANCH = 'main';

// ------------------------------------------
// 1. SISTEMA DE AUTENTICACIÓN
// ------------------------------------------
function handleAdminLogin(e) {
  if (e) e.preventDefault();
  
  const user = document.getElementById('adminUser').value.trim();
  const pass = document.getElementById('adminPass').value.trim();

  if (user === 'admin' && pass === 'aldea2026') {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    sessionStorage.setItem('aldea_logged', 'true');
    
    // Inicializar iconos de Lucide si está cargado
    if (window.lucide) {
      lucide.createIcons();
    }
    
    // Cargar la configuración actual desde config.json
    loadAdminConfig();
  } else {
    alert('Usuario o contraseña incorrectos.');
  }
}

function logoutAdmin() {
  sessionStorage.removeItem('aldea_logged');
  document.getElementById('adminDashboard').style.display = 'none';
  document.getElementById('loginBox').style.display = 'block';
}

// ------------------------------------------
// 2. CONEXIÓN CON GITHUB API
// ------------------------------------------
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
      alert('✅ ¡Cambios guardados con éxito! En 15 a 20 segundos Vercel actualizará la página para todos.');
      return true;
    } else {
      const errorData = await putRes.json();
      if (putRes.status === 401) {
        alert('❌ Token de GitHub inválido. Intenta de nuevo.');
        localStorage.removeItem('gh_admin_token');
      } else {
        alert(`❌ Error al guardar en GitHub: ${errorData.message}`);
      }
      return false;
    }
  } catch (error) {
    console.error('Error de red:', error);
    alert('❌ Ocurrió un error de red al conectar con GitHub.');
    return false;
  }
}

// ------------------------------------------
// 3. ACCIONES DE GUARDADO
// ------------------------------------------

// A. Guardar Feed Instagram
async function saveInstaConfig(e) {
  if (e) e.preventDefault();
  const enabled = document.getElementById('instaToggle').checked;
  const username = document.getElementById('instaUsername').value.trim().replace('@', '');

  const updatedConfig = {
    instagram: {
      enabled: enabled,
      username: username
    }
  };

  await saveToJsonInGitHub(
    'config.json',
    updatedConfig,
    `Actualización Feed Instagram: ${enabled ? 'Activado' : 'Desactivado'} (${username})`
  );
}

// B. Guardar Nuevo Horario / Docente
async function saveNewHorario(e) {
  if (e) e.preventDefault();
  
  const unidad = document.getElementById('addMateria').value.trim();
  const docente = document.getElementById('addDocente').value.trim();
  const trayecto = document.getElementById('addTrayecto').value;
  const diaHorario = document.getElementById('addHorario').value.trim();
  const aula = document.getElementById('addAula').value.trim();

  try {
    const res = await fetch('./horarios.json');
    const horarios = res.ok ? await res.json() : [];

    const nuevoHorario = {
      id: Date.now().toString(),
      unidad,
      docente,
      trayecto,
      horario: diaHorario,
      aula
    };

    horarios.push(nuevoHorario);

    const ok = await saveToJsonInGitHub(
      'horarios.json',
      horarios,
      `Agregar nuevo horario: ${unidad}`
    );

    if (ok && e && e.target) e.target.reset();
  } catch (err) {
    alert('Error al leer el archivo horarios.json actual.');
  }
}

// C. Guardar Nuevo Documento
async function saveNewDoc(e) {
  if (e) e.preventDefault();

  const titulo = document.getElementById('addDocTitulo').value.trim();
  const categoria = document.getElementById('addDocCat').value.trim();
  const contenido = document.getElementById('addDocContenido').value.trim();

  try {
    const res = await fetch('./repositorio.json');
    const docs = res.ok ? await res.json() : [];

    const nuevoDoc = {
      id: Date.now().toString(),
      titulo,
      categoria,
      contenido,
      fecha: new Date().toISOString().split('T')[0]
    };

    docs.push(nuevoDoc);

    const ok = await saveToJsonInGitHub(
      'repositorio.json',
      docs,
      `Agregar nuevo documento: ${titulo}`
    );

    if (ok && e && e.target) e.target.reset();
  } catch (err) {
    alert('Error al leer el archivo repositorio.json actual.');
  }
}

// ------------------------------------------
// 4. CARGA DE CONFIGURACIÓN Y ESTADO
// ------------------------------------------
async function loadAdminConfig() {
  try {
    const res = await fetch('./config.json');
    if (res.ok) {
      const config = await res.json();
      const toggle = document.getElementById('instaToggle');
      const userInput = document.getElementById('instaUsername');

      if (toggle && userInput && config.instagram) {
        toggle.checked = config.instagram.enabled;
        userInput.value = config.instagram.username || '';
      }
    }
  } catch (err) {
    console.error('Error al cargar config.json:', err);
  }
}

// Mantener la sesión iniciada al recargar la página dentro de la misma pestaña
document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) {
    lucide.createIcons();
  }

  if (sessionStorage.getItem('aldea_logged') === 'true') {
    document.getElementById('loginBox').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadAdminConfig();
  }
});
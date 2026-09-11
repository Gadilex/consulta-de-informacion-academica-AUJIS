# 🏛️ Plataforma Digital de Consulta de Información Académica
> **Aldea Universitaria "José Isidro Silva" — Misión Sucre**

Una solución web dinámica, liviana y centralizada diseñada para la gestión y consulta de información académica, horarios de clases, cuerpo docente y repositorios de documentos oficiales para la comunidad de la **Aldea Universitaria "José Isidro Silva"**.

---

## 📋 Tabla de Contenidos

- [📌 Descripción del Proyecto](#-descripción-del-proyecto)
- [✨ Características Principales](#-características-principales)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [🏗️ Arquitectura y Estructura del Proyecto](#️-arquitectura-y-estructura-del-proyecto)
- [🔐 Panel de Administración](#-panel-de-administración)
- [⚡ Despliegue en Vercel](#-despliegue-en-vercel)
- [👥 Contribuyentes](#-contribuyentes)

---

## 📌 Descripción del Proyecto

La **Aldea Universitaria "José Isidro Silva"** requería una plataforma digital accesible que permitiera a los estudiantes y docentes consultar la programación académica de los distintos Trayectos y PNF, acceder a documentación oficial y mantenerse informados sobre los comunicados institucionales.

Este proyecto aborda dicha necesidad mediante un desarrollo web **Frontend nativo (Vanilla JavaScript)** respaldado por una arquitectura *Serverless/Jamstack*, utilizando archivos de datos JSON y la API pública de GitHub para permitir la actualización de contenidos sin necesidad de un backend tradicional con base de datos dedicada.

---

## ✨ Características Principales

- 📅 **Consulta de Horarios y Unidades Curriculares:** Visualización organizada de materias, profesores colaboradores, horarios y aulas según el Trayecto seleccionado.
- 📂 **Repositorio Documental:** Acceso a reglamentos, calendarios académicos y circulares informativas.
- 📱 **Integración con Feed Social:** Sección interactiva para visualizar las publicaciones oficiales de Instagram de la aldea.
- 🔐 **Panel Administrativo Integrado (`admin.html`):**
  - Gestión e inserción de nuevos horarios y asignación de docentes.
  - Registro de nuevos documentos institucionales.
  - Activación/desactivación y configuración del feed de Instagram.
  - Persistencia de datos mediante **GitHub REST API** (Commits automáticos a `main`).
- 🎨 **Diseño Responsivo e Incluyente:** Interfaz adaptada a dispositivos móviles, tablets y computadoras de escritorio.

---

## 🛠️ Tecnologías Utilizadas

- **HTML5 & CSS3:** Estructuración semántica y diseño visual dinámico con soporte para modo oscuro.
- **JavaScript (Vanilla JS - ES6+):** Lógica del lado del cliente, manipulación del DOM y consumo de APIs.
- **GitHub REST API:** Utilizada como motor de almacenamiento/CMS desacoplado (*Headless Content Sync*).
- **Lucide Icons:** Iconografía vectorial moderna y ligera.
- **Vercel:** Plataforma de despliegue continuo (CI/CD) alojada en la nube.

---

## 🏗️ Arquitectura y Estructura del Proyecto

```text
├── index.html           # Página principal pública (Consulta general)
├── admin.html           # Panel de acceso y gestión administrativa
├── styles.css           # Hoja de estilos global y adaptativa
├── app.js               # Lógica interactiva del cliente público
├── admin.js             # Lógica del panel administrativo y conexión con GitHub API
├── config.json          # Configuración dinámica del feed y parámetros globales
├── horarios.json        # Base de datos JSON de horarios y docentes
├── repositorio.json     # Base de datos JSON de documentos oficiales
└── logo.png             # Identificador visual de la Aldea
```

---

## 🔐 Panel de Administración

El panel administrativo permite a las autoridades y coordinadores de la aldea mantener la información actualizada en tiempo real sin requerir conocimientos técnicos avanzados.

### Acceso Predeterminado:
- **Ruta:** `/admin.html`
- **Usuario:** `admin`
- **Contraseña:** `aldea2026`

### Flujo de Actualización de Datos:
1. El administrador inicia sesión en el panel.
2. Realiza cambios o agrega nuevos registros (Horarios, Documentos o Configuración).
3. Introduce un **Personal Access Token (PAT)** de GitHub con permisos de escritura.
4. El script actualiza el archivo `.json` correspondiente directamente en el repositorio vía API de GitHub.
5. **Vercel** detecta el *commit* automáticamente y re-despliega la aplicación en **15 a 20 segundos**.

---

## ⚡ Despliegue en Vercel

El proyecto está configurado para despliegue automático continuo. Cada vez que se realiza un *push* o se actualiza un archivo `.json` desde el panel administrativo, Vercel genera una nueva versión lista para producción.

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Gadilex/consulta-de-informacion-academica-AUJIS.git
   ```
2. Importa el repositorio desde la consola de **Vercel**.
3. Selecciona el *Framework Preset* como **Other / Vanilla HTML**.
4. Haz clic en **Deploy**.

---

## 👥 Contribuyentes

Proyecto desarrollado como propuesta tecnológica y académica para la **Aldea Universitaria "José Isidro Silva"**.

* **Desarrollo y Diseño:** Equipo de Proyectos PNF - Misión Sucre
* **Institución:** Aldea Universitaria "José Isidro Silva"

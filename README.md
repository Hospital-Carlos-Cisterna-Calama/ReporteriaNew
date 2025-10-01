# 🧩 Plantilla Node.js + TypeScript Base

Este repositorio es una **plantilla base** para proyectos backend con Node.js + TypeScript, lista para usarse en aplicaciones tipo API REST. Incluye autenticación JWT, validaciones con Joi, manejo de archivos, exportación PDF/Excel/CSV, y ORM con Sequelize para bases de datos relacionales.

---

## 🚀 Tecnologías incluidas

| Categoría         | Tecnologías                                                             |
|-------------------|--------------------------------------------------------------------------|
| Core              | Node.js, TypeScript, Express                                             |
| ORM               | Sequelize, Sequelize-Typescript, Tedious (SQL Server)                   |
| Validaciones      | Joi                                                                      |
| Seguridad         | JWT (jsonwebtoken), Bcrypt/BcryptJS                                      |
| Archivos          | Multer (upload), PDFKit (PDF), ExcelJS, JSON2CSV                        |
| Utilidades        | dotenv, cors, morgan, form-data                                          |
| Formato de código | Prettier                                                                 |
| Build             | tsx, pkgroll, typescript                                                 |
| Front opcional    | React y ReactDOM (puede ser removido si no se usa en el backend)         |

---

## 📦 Scripts disponibles

| Comando        | Descripción                                      |
|----------------|--------------------------------------------------|
| `npm run dev`  | Inicia el servidor en modo desarrollo con tsx    |
| `npm run build`| Compila el código TypeScript y ejecuta pkgroll   |
| `npm run start`| Ejecuta el proyecto desde `dist/index.js`        |
| `npm run format`| Aplica Prettier a todos los archivos            |

---

## 🗂 Estructura recomendada del proyecto

\`\`\`
src/
├── controllers/      # Controladores de rutas
├── services/         # Lógica de negocio
├── models/           # Modelos Sequelize
├── routes/           # Archivos de rutas Express
├── middlewares/      # Middlewares personalizados (auth, error handler, etc.)
├── utils/            # Utilidades varias (PDF, Excel, errores)
├── config/           # Configuraciones generales (db, env)
└── index.ts          # Entry point principal
\`\`\`

---

## ⚙️ Configuración inicial

1. Clona este repositorio:
   \`\`\`bash
   git clone https://github.com/SJuan004/Plantilla_NodeTypeBase.git
   \`\`\`

2. Instala dependencias:
   \`\`\`bash
   npm install
   \`\`\`

3. Crea un archivo `.env` basado en `.env.example`:
   \`\`\`env
   PORT=3000
   JWT_SECRET=your_secret_key
   DB_HOST=localhost
   DB_USER=your_user
   DB_PASS=your_password
   DB_NAME=your_database
   \`\`\`

4. Ejecuta en modo desarrollo:
   \`\`\`bash
   npm run dev
   \`\`\`

---

## 🧪 Exportación de datos

Esta plantilla incluye soporte para:
- Exportar a **PDF** con `pdfkit`
- Exportar a **Excel** con `exceljs`
- Exportar a **CSV** con `json2csv`

---

## 🔐 Autenticación

Manejo de usuarios con:
- Tokens JWT
- Encriptación de contraseñas con Bcrypt o BcryptJS
- Middleware de autenticación

---

## 📄 Licencia

Este proyecto está bajo la licencia ISC. Puedes modificarlo y adaptarlo libremente.

---

## ✨ Créditos

Plantilla desarrollada por [SHuanca004](https://github.com/SHuanca004) como base para APIs robustas, organizadas y escalables.

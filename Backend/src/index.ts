// ⚠️ ¡Debe ser la PRIMERA línea!
import 'dotenv/config'; // Carga variables del .env ANTES de usar Sequelize o cualquier config

import app from './app';
import { connectDatabase } from './config/initDatabase';

// Puerto por defecto
const PORT = Number(process.env.PORT) || 3002;

/* ──────────────────────────────
   🔹 Inicialización principal
────────────────────────────── */
(async () => {
  try {
    console.log('🚀 Iniciando servidor...');
    console.log('🌐 Intentando conectar a las bases de datos...');

    // ✅ Conecta a todas las bases
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`✅ Servidor escuchando en: http://localhost:${PORT}`);
      console.log(`⚡ Modo: ${process.env.NODE_ENV || 'Desarrollo'}`);
    });
  } catch (error) {
    console.error('❌ Error de inicio del servidor o base de datos:');
    console.error(error);
    process.exit(1); 
  }
})();

/* ──────────────────────────────
   🔹 Errores globales (seguridad extra)
────────────────────────────── */
process.on('unhandledRejection', err => {
  console.error('❌ Unhandled Rejection:', err);
});

process.on('uncaughtException', err => {
  console.error('❌ Uncaught Exception:', err);
});

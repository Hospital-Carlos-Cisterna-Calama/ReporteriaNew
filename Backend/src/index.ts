import 'dotenv/config';
import app from './app';
import { initDatabaseTrazaFactura } from './config/databaseTrazaFactura';

const PORT = Number(process.env.PORT) || 3002;

(async () => {
  try {
    // Sincronizar base de datos
    await initDatabaseTrazaFactura('connect'); // Cambia este parámetro según necesites

    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
      console.log(`⚡ Modo: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error de inicio:', error);
    process.exit(1);
  }
})();

// Manejo de errores globales
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});

import 'dotenv/config';
import app from './app';
import { initDatabase } from './config/databaseEnti';

const PORT = Number(process.env.PORT) || 3002;

(async () => {
  try {
    // Sincronizar base de datos
    await initDatabase('connect'); // Cambia este parámetro según necesites

    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
      console.log(`⚡ Modo: ${process.env.NODE_ENV || 'development'}`);
    });

    // Aumentar timeout del servidor a 5 minutos para reportes pesados
    server.timeout = 300000; // 5 minutos
    server.keepAliveTimeout = 310000; // 5 minutos + 10 segundos
    server.headersTimeout = 320000; // 5 minutos + 20 segundos
    
    console.log(`⏱️  Timeout del servidor: ${server.timeout}ms (${server.timeout / 1000}s)`);
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

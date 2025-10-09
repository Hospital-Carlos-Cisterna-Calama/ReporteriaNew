import 'dotenv/config';
import app from './app';
import { initDatabase } from './config/initDatabase';

const PORT = Number(process.env.PORT) || 3001;

(async () => {
  try {
    await initDatabase('connect'); 

    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
      console.log(`⚡ Modo: ${process.env.NODE_ENV || 'development'}`);
    });

    server.timeout = 300000; 
    server.keepAliveTimeout = 310000; 
    server.headersTimeout = 320000; 

    console.log(`⏱️  Timeout del servidor: ${server.timeout}ms (${server.timeout / 1000}s)`);
  } catch (error) {
    console.error('❌ Error de inicio:', error);
    process.exit(1);
  }
})();

process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', err => {
  console.error('Uncaught Exception:', err);
});

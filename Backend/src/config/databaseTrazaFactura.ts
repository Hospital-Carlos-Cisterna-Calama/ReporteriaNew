import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';

dotenv.config();

// Configuración básica de Sequelize
export const sequelize = new Sequelize({
  dialect: 'mssql',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT) || 1433,
  username: process.env.DB_USER ?? 'sa',
  password: process.env.DB_PASS ?? 'TuPassword',
  database: process.env.DB_NAME ?? 'TuBaseDeDatos',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 30000,
    },
  },
  models: [],
});

// Aplica asociaciones entre modelos

/**
 * Opción 1: Conexión simple sin sincronización (para producción)
 */
export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos NEW establecida');
    return true;
  } catch (error: any) {
    console.error('❌ Error al conectar a la base de datos:');
    console.error(error.message);
    throw error;
  }
}

/**
 * Opción 2: Sincronización con alter (para desarrollo)
 */
export async function syncAlterDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Base de datos sincronizada (modo alter)');
    return true;
  } catch (error: any) {
    console.error('❌ Error al sincronizar (alter):');
    console.error(error.message);
    throw error;
  }
}

/**
 * Opción 3: Sincronización forzada (solo para desarrollo inicial)
 */
export async function syncForceDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('✅ Base de datos recreada completamente');
    return true;
  } catch (error: any) {
    console.error('❌ Error al sincronizar (force):');
    console.error(error.message);
    throw error;
  }
}

export async function syncInitialDatabase() {
  try {
    await sequelize.sync(); // por defecto: crea tablas faltantes, no toca las existentes
    console.log('✅ Tablas creadas (create initial)');
    return true;
  } catch (error: any) {
    console.error('❌ Error al crear inicial:');
    console.error(error.message);
    throw error;
  }
}

/**
 * Función de inicialización flexible
 * @param mode 'connect' | 'alter' | 'force' | 'initial'
 */
export async function initDatabaseTrazaFactura(mode: 'connect' | 'alter' | 'force' | 'initial' = 'connect') {
  switch (mode) {
    case 'alter':
      return await syncAlterDatabase();
    case 'force':
      return await syncForceDatabase();
    case 'initial':
      return await syncInitialDatabase();
    case 'connect':
    default:
      return await connectDatabase();
  }
}

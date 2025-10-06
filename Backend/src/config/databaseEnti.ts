import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import { Ambito, Carpeta } from '../models';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'mssql',
  host: process.env.DB_ENTI_HOST ?? 'localhost',
  port: Number(process.env.DB_ENTI_PORT) || 1433,
  username: process.env.DB_ENTI_USER ?? 'sa',
  password: process.env.DB_ENTI_PASS ?? 'TuPassword',
  database: process.env.DB_ENTI_NAME ?? 'TuBaseDeDatos',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 30000,
    },
  },
  models: [Ambito, Carpeta],
});

/**
 * Opción 1: Conexión simple sin sincronización (para producción)
 */
export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos ENTI establecida');
    return true;
  } catch (error: any) {
    console.error('❌ Error al conectar a la base de datos:');
    console.error(error.message);
    throw error;
  }
}

/**
 * Función de inicialización flexible
 * @param mode 'connect' | 'alter' | 'force' | 'initial'
 */
export async function initDatabase(mode: 'connect' | 'alter' | 'force' | 'initial' = 'connect') {
  switch (mode) {
    case 'connect':
    default:
      return await connectDatabase();
  }
}

import { Sequelize } from 'sequelize-typescript';
import dotenv from 'dotenv';
import {
  Ambito,
  Carpeta,
  EvenIntr,
  Lugar,
  McTabSala,
  Nomina,
  PabPrio,
  Paciente,
  Patagreg,
  Especiali,
  PrePrestacion,
  Profesional,
  RpaForDau,
  SeguUsuario,
  SerEspeciali,
  SerObjeto,
  SerServicios,
  SerServiciosAuge,
  Solicitud,
  TabDestinoPac,
  TabDiagnosticosFav,
  TabTratamientosFav,
  TabUbicacionPiso,
  TipoAnest,
  UrgRegistro,
  EvolucionHospitalizacion,
  IngresoCerradaEstablecer,
  CamasCritica,
  Donaciones,
  IngresoPpv,
  Ppv,
  PpvCopdigo,
  PpvServicios,
  Rph,
  RphEspecialidad,
  SolicitudPrestacion,
  Prestacion,
  ProcCitas,
  ProcRegClinico,
} from '../models';
import TabActivos from '../models/BdProcedimientos/TabActivos';
import NetActivoTipoProg from '../models/BdProcedimientos/NetActivoTipoProg';
import TabEquipamiento from '../models/BdProcedimientos/TabEquipamiento';
import { asociaciones } from '../models/Asociaciones';

dotenv.config();

export const sequelize = new Sequelize({
  dialect: 'mssql',
  host: process.env.DB_ENTI_HOST,
  port: Number(process.env.DB_ENTI_PORT) || 1433,
  username: process.env.DB_ENTI_USER ?? 'sa',
  password: process.env.DB_ENTI_PASS ?? 'TuPassword',
  database: process.env.DB_ENTI_NAME ?? 'TuBaseDeDatos',
  logging: process.env.NODE_ENV === 'Desarrollo' ? console.log : false,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 30000,
    },
  },
  models: [
    Ambito,
    Carpeta,
    EvenIntr,
    Lugar,
    McTabSala,
    Nomina,
    PabPrio,
    Paciente,
    Patagreg,
    Especiali,
    PrePrestacion,
    Profesional,
    RpaForDau,
    SeguUsuario,
    SerEspeciali,
    SerObjeto,
    SerServicios,
    SerServiciosAuge,
    Solicitud,
    TabDestinoPac,
    TabDiagnosticosFav,
    TabTratamientosFav,
    TabUbicacionPiso,
    TipoAnest,
    UrgRegistro,
  ],
});

export const sequelizePPV = new Sequelize({
  dialect: 'mssql',
  host: process.env.DB_PPV_HOST ?? 'localhost',
  port: Number(process.env.DB_PPV_PORT) || 1433,
  username: process.env.DB_PPV_USER ?? 'sa',
  password: process.env.DB_PPV_PASS ?? 'TuPassword',
  database: process.env.DB_PPV_NAME ?? 'TuBaseDeDatos',
  logging: process.env.NODE_ENV === 'Desarrollo' ? console.log : false,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 30000,
    },
  },
  models: [CamasCritica, Donaciones, IngresoPpv, Ppv, PpvCopdigo, PpvServicios, Prestacion, Rph, RphEspecialidad, SolicitudPrestacion],
});

export const sequelizeHCE = new Sequelize({
  dialect: 'mssql',
  host: process.env.DB_HCE_HOST ?? 'localhost',
  port: Number(process.env.DB_HCE_PORT) || 1433,
  username: process.env.DB_HCE_USER ?? 'sa',
  password: process.env.DB_HCE_PASS ?? 'TuPassword',
  database: process.env.DB_HCE_NAME ?? 'TuBaseDeDatos',
  logging: process.env.NODE_ENV === 'Desarrollo' ? console.log : false,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 30000,
    },
  },
  models: [EvolucionHospitalizacion, IngresoCerradaEstablecer],
});

export const sequelizeProcedimiento = new Sequelize({
  dialect: 'mssql',
  host: process.env.DB_PROCEDIMIENTOS_HOST ?? 'localhost',
  port: Number(process.env.DB_PROCEDIMIENTOS_PORT) || 1433,
  username: process.env.DB_PROCEDIMIENTOS_USER ?? 'sa',
  password: process.env.DB_PROCEDIMIENTOS_PASS ?? 'TuPassword',
  database: process.env.DB_PROCEDIMIENTOS_NAME ?? 'TuBaseDeDatos',
  logging: process.env.NODE_ENV === 'Desarrollo' ? console.log : false,
  dialectOptions: {
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: 30000,
    },
  },
  models: [ProcCitas, ProcRegClinico, TabActivos, NetActivoTipoProg, TabEquipamiento],
});

export async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a la base de datos ENTI_CORPORATIVA establecida');

    await sequelizePPV.authenticate();
    console.log('✅ Conexión a la base de datos PPV establecida');

    await sequelizeHCE.authenticate();
    console.log('✅ Conexión a la base de datos HCE establecida');

    await sequelizeProcedimiento.authenticate();
    console.log('✅ Conexión a la base de datos PROCEDIMIENTOS establecida');

    asociaciones();

    return true;
  } catch (error: any) {
    console.error('❌ Error al conectar a las bases de datos:');
    console.error(error.message);
    throw error;
  }
}

export async function initDatabase(mode: 'connect' | 'alter' | 'force' | 'initial' = 'connect') {
  switch (mode) {
    case 'connect':
    default:
      return await connectDatabase();
  }
}

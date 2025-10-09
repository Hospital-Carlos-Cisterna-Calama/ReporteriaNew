import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import { validateToken } from './middlewares/verifyToken';
import reporteriaRouter from './routes';
import ppvRouter from './routes/ppv/PPV.routes';

const app = express();

/* ──────────────────────────────
   🔹 Configuración CORS
────────────────────────────── */
app.use(
  cors({
    origin: ['http://localhost:4200', 'http://127.0.0.1:4200', 'http://127.0.0.1:4300'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  })
);
app.options('*', cors());

/* ──────────────────────────────
   🔹 Middlewares globales
────────────────────────────── */
app.use(express.json());
app.use(morgan('dev'));

/* ──────────────────────────────
   🔹 Rutas API
────────────────────────────── */
// app.use('/api', validateToken, reporteriaRouter); // 👈 activar si necesitas protección por token
app.use('/api', reporteriaRouter);
app.use('/api/ppv', ppvRouter);

/* ──────────────────────────────
   🔹 Ruta raíz (prueba rápida)
────────────────────────────── */
app.get('/', (_req, res) => {
  res.send('✅ Sistema de Reportes - API funcionando');
});

/* ──────────────────────────────
   🔹 Manejo de errores global
────────────────────────────── */
app.use(errorHandler);

export default app;

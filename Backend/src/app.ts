import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';
import { validateToken } from './middlewares/verifyToken';
import reporteriaRouter from './routes/Reporteria';

const app = express();

/* ─ CORS ─ */
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000','http://127.0.0.1:4300', 'http://ticket.hospitalcalama.cl'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  })
);
app.options('*', cors());

/* ─ Middleware globales ─ */
app.use(express.json());
app.use(morgan('dev'));
// ← Descomenta si tus rutas deben ir protegidas

//app.use('/api', validateToken, reporteriaRouter); DESCOMENTAR LA RUTA PROTEGIDA

app.use('/api/reporteria', reporteriaRouter);

/* ─ Ruta raíz ─ */
app.get('/', (_req, res) => {
  res.send('✅ Sistema de Reportes - API funcionando');
});
/* ─ Manejo centralizado de errores ─ */
app.use(errorHandler);

export default app;

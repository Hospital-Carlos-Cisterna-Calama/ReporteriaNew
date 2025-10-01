import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { errorHandler } from './middlewares/error.middleware';

const app = express();

/* ─ CORS ─ */
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://ticket.hospitalcalama.cl'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
    credentials: true,
  })
);
app.options('*', cors());

/* ─ Middleware globales ─ */
app.use(express.json());
app.use(morgan('dev'));

/* ─ Ruta raíz ─ */
app.get('/', (_req, res) => {
  res.send('✅ Sistema de Tickets - API funcionando');
});
/* ─ Manejo centralizado de errores ─ */
app.use(errorHandler);

export default app;

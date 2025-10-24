import { Router } from 'express';

import reporteriaRouter from './Reporteria/Reporteria.routes';
import ppvRouter from './ppv/PPV.routes';
import especialidadRouter from './ppv/catalogos.routes';
import siclopeRouter from './siclope/Siclope.routes';
import { validateToken } from '../middlewares/verifyToken';

const router = Router();

// router.use(validateToken); // Desactivado para pruebas sin token

// ▸ /api/reporteria/*
router.use('/urgencia', reporteriaRouter);
router.use('/ppv', ppvRouter);
router.use('/catalogos', especialidadRouter);
router.use('/siclope', siclopeRouter);

export default router;

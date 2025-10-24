import { Router } from 'express';

import reporteriaRouter from './Reporteria/Reporteria.routes';
import ppvRouter from './ppv/PPV.routes';
import especialidadRouter from './ppv/catalogos.routes';
import { validateToken } from '../middlewares/verifyToken';
import siclopeRouter from './siclope/Siclope.routes';

const router = Router();

// router.use(validateToken);

// ▸ /api/reporteria/*
router.use('/urgencia', reporteriaRouter);
router.use('/ppv', ppvRouter);
router.use('/catalogos', especialidadRouter);
router.use('/siclope', siclopeRouter);

export default router;

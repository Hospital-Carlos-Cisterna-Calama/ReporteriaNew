import { Router } from 'express';

import reporteriaRouter from './Reporteria/Reporteria.routes';
import ppvRouter from './ppv/PPV.routes';
import { validateToken } from '../middlewares/verifyToken';
import catalogosRouter from './catalogos.routes';
import siclopeRouter from './Siclope/Siclope.routes';

const router = Router();

// router.use(validateToken);

// ▸ /api/reporteria/*
router.use('/urgencia', reporteriaRouter);
router.use('/ppv', ppvRouter);
router.use('/catalogos', catalogosRouter);
router.use('/siclope', siclopeRouter);

export default router;

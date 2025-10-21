import { Router } from 'express';

import reporteriaRouter from './Reporteria/Reporteria.routes';
import ppvRouter from './ppv/PPV.routes';
import especialidadRouter from './ppv/catalogos.routes';
import { validateToken } from '../middlewares/verifyToken';

const router = Router();

router.use(validateToken);


// ▸ /api/reporteria/*
router.use('/urgencia', reporteriaRouter);
router.use('/ppv', ppvRouter);
router.use('/catalogos', especialidadRouter);


export default router;

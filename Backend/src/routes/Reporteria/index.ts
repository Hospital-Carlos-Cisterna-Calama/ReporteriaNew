import { Router } from 'express';

import reporteriaRouter from './Reporteria.routes';

const router = Router();

// ▸ /api/reporteria/*
router.use('/urgencia', reporteriaRouter);

export default router;

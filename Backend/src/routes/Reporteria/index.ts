import { Router } from 'express';

import reporteriaRouter from './Reporteria.routes';

const router = Router();

// ▸ /api/reporteria/*
router.use('/reporteria', reporteriaRouter);

export default router;

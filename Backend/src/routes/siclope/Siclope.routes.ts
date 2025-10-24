import { Router } from 'express';
import { SiclopeController } from '../../controller/Siclope.controller';
import { asyncHandler } from '../../utils/asyncHandler';
import { validateSchema } from '../../middlewares/validation';
import Joi from 'joi';

const siclopeRouter = Router();

// Schema para validar fechas en formato YYYY-MM-DD
const contrareferenciaSchema = Joi.object({
  fechaIni: Joi.string().required().messages({
    'string.empty': 'La fecha de inicio es requerida',
    'any.required': 'La fecha de inicio es requerida',
  }),
  fechaTermino: Joi.string().required().messages({
    'string.empty': 'La fecha de término es requerida',
    'any.required': 'La fecha de término es requerida',
  }),
});

siclopeRouter.get('/contrareferencia', validateSchema(contrareferenciaSchema), asyncHandler(SiclopeController.exportarContrareferencia));

export default siclopeRouter;

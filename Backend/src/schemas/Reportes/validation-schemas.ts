// src/schemas/validation-schemas.ts
import Joi from 'joi';

// ----- Param Schemas -----
export const getReporteUrgenciaSchema = Joi.object({
  fechaInicio: Joi.string().required(),
  fechaTermino: Joi.string().required(),
  tipoFormulario: Joi.string().max(2).required(),
});

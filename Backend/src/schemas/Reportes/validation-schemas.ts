import Joi from 'joi';

// ----- Param Schemas -----
export const ValidarDataUrgenciaSchema = Joi.object({
  fechaInicio: Joi.string().required(),
  fechaTermino: Joi.string().required(),
  box: Joi.string().valid('M', 'U', 'A', 'H', 'P').optional(),
});
export const ValidarFechaUrgenciaSchema = Joi.object({
  fecha: Joi.string().required(),
});

import Joi from 'joi';

// ----- Param Schemas -----
export const getReporteUrgenciaSchema = Joi.object({
  fechaInicio: Joi.string().required(),
  fechaTermino: Joi.string().required(),
  box: Joi.string().valid('M', 'U').required(),
  tipoFormu: Joi.string().required(),
});

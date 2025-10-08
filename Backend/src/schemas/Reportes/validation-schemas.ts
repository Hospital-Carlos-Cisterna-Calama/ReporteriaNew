import Joi from 'joi';

// ----- Param Schemas -----
export const getReporteUrgenciaSchema = Joi.object({
  fechaInicio: Joi.string().required(),
  fechaTermino: Joi.string().required(),
  box: Joi.string().valid('M', 'U').required(),
  tipoFormu: Joi.string().required(),
});

// PPV Reportes

export const hospitalizacionesPorServicioSchema = Joi.object({
  fechaInicio: Joi.string().isoDate().required().messages({
    'string.empty': 'Debe indicar la fecha de inicio',
    'any.required': 'La fecha de inicio es obligatoria',
  }),
  fechaFin: Joi.string().isoDate().required().messages({
    'string.empty': 'Debe indicar la fecha de término',
    'any.required': 'La fecha de término es obligatoria',
  }),
  especialidad: Joi.string().optional().allow(null, '').messages({
    'string.base': 'La especialidad debe ser un texto válido',
  }),
});

export const ingresosEgresosSchema = Joi.object({
  fechaInicio: Joi.string().isoDate().required(),
  fechaFin: Joi.string().isoDate().required(),
  unidad: Joi.string().required().messages({ 'any.required': 'Debe indicar la unidad' }),
  filtro: Joi.string().valid('ingreso', 'egreso', 'todos').default('todos').messages({
    'any.only': 'El filtro debe ser "ingreso", "egreso" o "todos"',
  }),
});

export const intervencionPabellonSchema = Joi.object({
  fechaInicio: Joi.string().isoDate().required(),
  fechaFin: Joi.string().isoDate().required(),
  pabellonId: Joi.string().optional().allow(null, ''),
});

export const irGrdSchema = Joi.object({
  fechaInicio: Joi.string().isoDate().required(),
  fechaFin: Joi.string().isoDate().required(),
});

export const listaEsperaSchema = Joi.object({
  fechaInicio: Joi.string().isoDate().required(),
  fechaFin: Joi.string().isoDate().required(),
  tipo: Joi.number().valid(1, 2).required().messages({
    'any.only': 'El tipo debe ser 1 (Solicitud) o 2 (Realización)',
  }),
});

export const pacientesHospitalizadosSchema = Joi.object({
  fechaInicio: Joi.string().isoDate().required(),
  fechaFin: Joi.string().isoDate().required(),
  servicioId: Joi.string().optional().allow(null, ''),
});

export const procedimientosSchema = Joi.object({
  fechaInicio: Joi.string().isoDate().required(),
  fechaFin: Joi.string().isoDate().required(),
  especialidad: Joi.string().required().messages({
    'any.required': 'Debe indicar la especialidad',
  }),
});
